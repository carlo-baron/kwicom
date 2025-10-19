import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import { Post } from '@/models/Post';
import { Like } from '@/models/Like';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

export async function GET(req: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({
        ok: false,
        message: 'Please log in first',
      });
    }

    const decodedToken = jwt.verify(token, SECRET) as jwt.JwtPayload;
    const userId = decodedToken.id;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 5;

    const totalPosts = await Post.countDocuments({});
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'username')
      .lean();

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        const likes = await Like.find({post: post._id})
            .populate('user', 'username _id')
            .lean();

        const likedBy = likes.map(like => like.user)

        const liked = likedBy.some(
            (user) => user._id.toString() === userId.toString()
        );
        const likeCount = likedBy.length;

        return {
          ...post,
          likedBy,
          likeCount,
          liked
        };
      })
    );

    const hasNext = page * limit < totalPosts;

    return NextResponse.json({
      ok: true,
      posts: updatedPosts,
      page,
      hasNext,
    });
  } catch (error) {
    console.error('GET /posts error:', error);
    return NextResponse.json({
      ok: false,
      message: 'Internal Server Error',
    });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({
        ok: false,
        message: 'Please log in first',
      });
    }

    const decodedToken = jwt.verify(token, SECRET) as jwt.JwtPayload;
    const username = decodedToken.username;

    const { caption } = await req.json();

    if (!caption) {
      return NextResponse.json({
        ok: false,
        message: 'Invalid caption',
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({
        ok: false,
        message: 'User not found',
      });
    }

    const post = await Post.create({
      user: user._id,
      caption,
    });

    if (!post) {
      return NextResponse.json({
        ok: false,
        message: 'Failed to make post',
      });
    }

    return NextResponse.json({
      ok: true,
      message: `${username} created a new post`,
    });
  } catch (error) {
    console.error('POST /posts error:', error);
    return NextResponse.json({
      ok: false,
      message: 'Internal Server Error',
    });
  }
}

