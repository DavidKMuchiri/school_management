import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    async login(@Body('email') email: string,  @Body('password') password: string){
        const token = await this.authService.signIn(email, password);

        return token;
    }
}
