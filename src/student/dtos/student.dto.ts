import { IsBoolean, IsEmpty, IsNotEmpty, IsString } from "class-validator"

export class Student{
    id? : string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    middleName: string;

    @IsNotEmpty()
    class: string;

    @IsNotEmpty()
    classTeacher: string;

    @IsEmpty()
    studentID: number;

    attendance: Attendance[];
}

export class Attendance{
    @IsString()
    @IsNotEmpty()
    date: string;

    @IsBoolean()
    @IsNotEmpty()
    present: boolean;
}