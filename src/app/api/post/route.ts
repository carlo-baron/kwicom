import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import { Post } from '@/models/Post';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

export async function GET(){
    try{
        await connectDB();

        const posts = await Post.find({})
                            .sort({'createdAt': 1})
                            .limit(2)
                            .populate('user', 'username');
        return NextResponse.json({
            ok: true,
            posts
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
            const decodedToken = jwt.verify(token, SECRET);
            const username = decodedToken.username;
            console.log("decoded");

            const { caption } = await req.json();

            if(caption){
                const user = await User.findOne({
                    username
                });
                const post = await Post.insertOne({
                    user: user, 
                    caption,
                    new: true
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
