import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { extractTokenFromHeader } from '../auth.utilities';
config()
  
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = await extractTokenFromHeader(request);
      if (!token) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.JWT_SECRET
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }
      return true;
    }
  
    // private extractTokenFromHeader(request: Request): string | undefined {
    //   const [type, token] = request.headers.authorization?.split(' ') ?? [];
    //   return type === 'Bearer' ? token : undefined;
    // }
  }