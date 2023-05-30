import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './dtos/student.dto';
import { Attendance } from './dtos/student.dto';

@Injectable()
export class StudentService {
    constructor(@InjectModel('Student') private readonly studentModel: Model<Student>){}

    async getAllStudents() : Promise<Student[]>{
        const students = await this.studentModel.find();

        return students;
    }

    async createStudent(body: Student) : Promise<number>{
        const existingStudent = await this.studentModel.findOne({$and: [
            { firstName: body.firstName},
            { middleName: body.middleName},
            { lastName: body.lastName },
          ],
        })

        if(existingStudent){
            throw new HttpException("Student already exists", HttpStatus.BAD_REQUEST);
            
        }
        const latestDocument = await this.studentModel.findOne().sort({ _id: -1 });
        if(latestDocument){
            body.studentID = latestDocument.studentID + 1;
        }else{
            body.studentID = 1;
        }
        const newStudent = new this.studentModel(body);
        const result = await newStudent.save();

        return result.studentID as number;
    }

    async updateAttendance(studentId: number, attendance: Attendance) : Promise<{}>{
       const student = await this.findStudent(studentId);
       let result : {};
       if(student){
            let existingAttendance = await this.findAttendance(attendance.date, studentId);
            if(existingAttendance){
                // console.log(await this.findAttendance(attendance.date, studentId));
                result = await this.studentModel.findOneAndUpdate({studentID: studentId, 'attendance.date': attendance.date},
                    { $set: {'attendance.$.present': attendance.present}},
                    { new: true },
                  ); 
            }else{
                result = await this.studentModel.findOneAndUpdate({studentID: studentId},
                    { $push: {attendance: attendance}},
                    { new: true },
                  ); 
            }
              
       }

       return result


    }

    async findStudent(studentId: number) : Promise<Student>{
        const existingStudent = await this.studentModel.findOne({studentID: studentId});

        if(!existingStudent){
            throw new HttpException("No such student", HttpStatus.NOT_FOUND);
        }

        return existingStudent;
    }

    async removeStudent(studentId: number) : Promise<{}>{
        const existingStudent = await this.findStudent(studentId)
        const results = await this.studentModel.deleteOne({studentID: existingStudent.studentID});

        return results;
    }

    async findAttendance(date: string, studentId: number){
        const results = await this.studentModel.findOne({'attendance.date': date, studentID: studentId })

        return results;
    }

    async editStudentDetails(studentId: number, changes: Student) : Promise<{}>{
        const existingStudent = await this.findStudent(studentId)
        let results: {};
        if(existingStudent){
            results = await this.studentModel.findOneAndUpdate({studentID: studentId},
                changes,
                { new: true },
              )
        }

        return results;
    }
}
