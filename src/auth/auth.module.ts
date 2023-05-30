import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { UserModule } from 'src/user/user.module';
config()

@Module({
  imports: [UserModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRATION },
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
