import { Controller, Post, Body, UsePipes, ParseIntPipe, ValidationPipe, Param, Get, Delete, Put, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './dtos/student.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { Attendance } from './dtos/student.dto';

@Controller('student')
@UseGuards(AuthGuard, RolesGuard)
export class StudentController {
    constructor(private readonly studentService: StudentService){}
    
    @Get()
    @Roles(Role.Admin)
    async allStudents() : Promise<Student[]>{
        const students = await this.studentService.getAllStudents();

        return students;
    }


    @Post('create')
    @Roles(Role.Admin)
    @UsePipes(new ValidationPipe())
    async addNewStudent(@Body() body: Student) : Promise<{id: number}>{
        const generatedId = await this.studentService.createStudent(body);

        return {id: generatedId};
    }

    @Put('update/attendance/:id')
    @UsePipes(new ValidationPipe())
    async editAttendance(@Param('id', ParseIntPipe) studentId: number, @Body() attendance: Attendance){
        const results = await this.studentService.updateAttendance(studentId, attendance);
        return results;
    }

    @Get(':id')
    async getStudent(@Param('id', ParseIntPipe) studentId: number) : Promise<Student>{
        const student = await this.studentService.findStudent(studentId);
        return student;
    }

    @Put('update/:id')
    @Roles(Role.Admin)
    async updateStudentDetails(@Param('id', ParseIntPipe) studentId: number, @Body() changes: Student){
        const results  = await this.studentService.editStudentDetails(studentId, changes);

        return results;
    
    }

    @Delete('delete/:id')
    @Roles(Role.Admin)
    async deleteStudent(@Param('id', ParseIntPipe) studentId: number){
        const deleteResults = await this.studentService.removeStudent(studentId);

        return deleteResults;
    }
}
