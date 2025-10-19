import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import { compare } from '@/lib/hash';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

if(!SECRET) throw new Error("SECRET not set");

export async function POST(req: Request){
    try{
        await connectDB();

        const { username, password } = await req.json();
        const user = await User.findOne({
            username
        });

        if(user){
            const isValid = await compare(password, user.password);
            if(isValid){
                const token = jwt.sign(
                    { id: user._id, username: user.username },
                    SECRET,
                    { expiresIn: "24h" }
                );

                const res = NextResponse.json({
                    ok: true,
                    message: "Logged in successfully"
                });

                res.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'strict',
                    maxAge: 60 * 60,
                    path: '/',
                });

                return res;
            }else{
                return NextResponse.json({
                    ok: false,
                    message: "Incorrect Credentials",
                });
            }
        }else{
            return NextResponse.json({
                ok: false,
                message: "User not Found",
            });
        }
    }catch{
        return NextResponse.json({ok: false, message: "Internal server error" });
    }
}
