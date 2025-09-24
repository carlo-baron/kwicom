import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import { compare } from '@/lib/hash';

export async function GET(){
    try{
        await connectDB();
        const users = await User.find({});
        return NextResponse.json(users);
    }catch(err){
        return NextResponse.json({ok: false, error: err});
    }
}

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
                return NextResponse.json({
                    ok: true,
                    message: "Logged in successfully",
                });
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
    }catch(err){
        return NextResponse.json({ok: false, error: err});
    }
}
