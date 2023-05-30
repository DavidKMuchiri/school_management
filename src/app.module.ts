import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';

config()
@Module({
  imports: [UserModule, MongooseModule.forRoot(process.env.MONGO_DB_CONNECTION_STRING), AuthModule, StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
