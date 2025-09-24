import bcrypt from 'bcrypt';

const ROUNDS = 12;

export async function hash(text: string): Promise<string>{
    const hashed = await bcrypt.hash(text, ROUNDS); 
    return hashed;
}

export async function compare(text: string, hash: string): Promise<boolean>{
    return await bcrypt.compare(text, hash);
}
