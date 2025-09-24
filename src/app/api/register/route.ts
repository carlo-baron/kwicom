import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import { hash } from '@/lib/hash';

export async function POST(req: Request){
    try{
        await connectDB();

        const { username, password } = await req.json();
        const hashedPassword = await hash(password);

        try{
            await User.insertOne({
                username: username,
                password: hashedPassword
            });
            return NextResponse.json({
                ok: true,
                message: "User registered successfully"
            });
        }catch(err){
            return NextResponse.json({
                ok: false,
                message: "Failed to register user: " + err
            }); 
        }

    }catch(err){
        return NextResponse.json({ok: false, error: err});
    }
}
