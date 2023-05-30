import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './dtos/user.dto';
import { generateHash } from './user.utilities';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>){}

    async createAdmin(body : User) : Promise<string>{
        const existingUser = await this.userModel.findOne({ email: body.email });
        if(!existingUser){
            const hashedPassword = await generateHash(body.password);

            body.password = hashedPassword;
            let user : User= {
                role : ["admin"],
                ...body
            }
            const newAdmin = new this.userModel(user)
            const result = await newAdmin.save();

            return result.id as string;
        }else{
            throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
        }
        
    }

    async createTeacher(body : User) : Promise<string>{
        const existingUser = await this.userModel.findOne({ email: body.email });
        if(!existingUser){
            const hashedPassword = await generateHash(body.password);

            body.password = hashedPassword;
            let user : User= {
                role : ["teacher"],
                ...body
            }
            const newTeacher = new this.userModel(user)
            const result = await newTeacher.save();

            return result.id as string;
        }else{
            throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
        }
        
    }

    async findUser(email: string) : Promise<User>{
        let user: User;
        try {
            user = await this.userModel.findOne({email: email});
        } catch (error) {
            throw new HttpException("No such user", HttpStatus.NOT_FOUND);
        }

        if(!user){
            throw new HttpException("No such user", HttpStatus.NOT_FOUND);
        }else{
            return user;
        }
    }

    async getAllUsers() : Promise<User[]>{
        const users = await this.userModel.find();

        return users;
    }

    async updateUser(email: string, changes: User) : Promise<User>{
        let existingUser = await this.findUser(email);
        let results : User;
        if(existingUser){
            if(typeof changes.role !== "object" && changes.role){
                throw new HttpException("Role must be an array", HttpStatus.BAD_REQUEST);
            }else if(changes.password){
                changes.password = await generateHash(changes.password);
            }
            results = await this.userModel.findOneAndUpdate({email: email}, changes, {new: true});
        }

        return results;
    }

    async deleteUser(email: string){
        let existingUser = await this.findUser(email);
        let admins = await this.findAdmins();
        let results : {};

        if(existingUser){
            if(existingUser.role[0] === "admin" && admins.length < 2){
                throw new HttpException("System must have one admin", HttpStatus.BAD_REQUEST);
            }

            results = await this.userModel.deleteOne({email: email});
        }

        return results;
    }

    async findAdmins() : Promise<User[]>{
        const admins = await this.userModel.find({ role: { $in: ['admin'] } });

        return admins;
    }
}
