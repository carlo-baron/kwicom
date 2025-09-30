import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if(!token) return NextResponse.redirect(new URL('/login', req.url));

    try{
        await jwtVerify(token, SECRET);
        return NextResponse.next();
    }catch{
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: [
        '/home',
        '/api/post/:path*',
        '/api/users',
    ],
};
