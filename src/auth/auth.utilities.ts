import { Request } from 'express';

export async function extractTokenFromHeader(request: Request): Promise<string | undefined> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }