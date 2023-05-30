import * as bcrypt from 'bcrypt';

export async function generateHash(password: string) : Promise<string>{
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return hash;
}

export async function comparePasswordHash(password: string, hash: string) : Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);

    return isMatch;
}