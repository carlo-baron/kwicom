import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import { Post } from '@/models/Post';
import { Like } from '@/models/Like';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const SECRET = process.env.JWT_SECRET as string;

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

            const { postId } = await req.json();
            const isValidId = mongoose.Types.ObjectId.isValid(postId);
            if(!postId || !isValidId){
                return NextResponse.json({
                    ok: false,
                    message: "Invalid param",
                });
            }

            if(postId){
                const user = await User.findOne({
                    username
                });
                if(!user){
                    return NextResponse.json({
                        ok: false,
                        message: "User not found",
                    });
                }
                const post = await Post.findById(postId);
                if(!post){
                    return NextResponse.json({
                        ok: false,
                        message: "Post not found",
                    });
                }

                const isLiked = await Like.findOne({
                    user: user._id,
                    post: post._id
                });

                if(isLiked){
                    await Like.deleteOne({
                        user: user._id,
                        post: post._id
                    });

                    return NextResponse.json({
                        ok: true,
                        message: "Disliked post",
                        type: false,
                    });
                }else{
                    const like = await Like.create({
                        user: user._id, 
                        post: post._id,
                    });

                    if(like){
                        return NextResponse.json({
                            ok: true,
                            message: "Liked post",
                            type: true
                        });
                    }else{
                        return NextResponse.json({
                            ok: false,
                            message: "Failed to like post",
                        });
                    }
                }
            }else{
                return NextResponse.json({
                    ok: false,
                    message: "Invalid post ID",
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
