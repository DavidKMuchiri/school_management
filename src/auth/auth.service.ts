import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHash } from 'src/user/user.utilities';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
        private readonly jwtService: JwtService){}

    async signIn(email: string, pass: string){
        const user = await this.userService.findUser(email);
        const isMatch = await comparePasswordHash(pass, user.password);
        
        if(!user || !isMatch){
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
        }

        const payload = { sub: user.id, username: user.email, role: user.role};

        return {
            access_token: await this.jwtService.signAsync(payload),
        };

    }
}
