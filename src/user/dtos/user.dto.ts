import { IsNotEmpty, IsEmail, IsEmpty } from "class-validator"

export class User{
    id? : string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsEmpty()
    role: string[];


}