import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(){
    await connectDB();

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if(!token){
        return NextResponse.json({
            ok: false,
            message: "No token"
        });
    }

    try{
        const decoded = jwt.verify(token, SECRET);

        const users = await User.find().select("-password");
        return NextResponse.json({
            ok: true,
            users
        });
    }catch{
        return NextResponse.json({ ok: false, message: "Invalid token" });
    }
}
