import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import { Post } from '@/models/Post';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

export async function GET(req: Request){
    try{
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = 5;

        const totalPosts = await Post.countDocuments({});
        const posts = await Post.find({})
            .sort({'createdAt': -1})
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user', 'username');

        const hasNext = page * limit < totalPosts;

        return NextResponse.json({
            ok: true,
            posts,
            page,
            hasNext
        });
    }catch{
        return NextResponse.json({
            ok: false,
            message: "Internal Server Error"
        });
    }
}

export async function POST(req: Request){
    try{
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if(!token){ 
            return NextResponse.json({
            ok: false,
            message: "Please log in first",
        });
        }

        try{
            const decodedToken = jwt.verify(token, SECRET) as jwt.JwtPayload;
            const username = decodedToken.username;

            const { caption } = await req.json();

            if(caption){
                const user = await User.findOne({
                    username
                });
                if(!user){
                    return NextResponse.json({
                        ok: false,
                        message: "User not found",
                    });
                }
                const post = await Post.create({
                    user: user, 
                    caption,
                });
                const message = username + " create a new post";
                if(post){
                    return NextResponse.json({
                        ok: true,
                        message: message,
                    });
                }else{
                    return NextResponse.json({
                        ok: true,
                        message: caption,
                    });
                }
            }else{
                return NextResponse.json({
                    ok: false,
                    message: "Invalid Caption",
                });
            }
        }catch{
            return NextResponse.json({
                ok: false,
                message: "Invalid Token"
            });
        }
    }catch{
        return NextResponse.json({
            ok: true,
            message: "Internal Server Error."
        });
    }
}
