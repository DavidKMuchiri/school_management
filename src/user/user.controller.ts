import { Controller, Post, Body, UsePipes, ValidationPipe, Get, UseGuards, Put, Query, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './dtos/user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get('')
    async getAllUser(){
        const users = await this.userService.getAllUsers();
        return users;
    }

    @Get('one')
    async getOneUser(@Query('email') email: string) : Promise<User>{
        const user = await this.userService.findUser(email);

        return user
    }

    @Post('create')
    @UsePipes(new ValidationPipe())
    async addNewTeacher(@Body() body: User) : Promise<{id: string}>{
        const generatedId = await this.userService.createTeacher(body);
        return {id: generatedId};
    }

    @Put('update')
    async editUser(@Query('email') email: string, @Body() changes: User) : Promise<User>{
        const results = await this.userService.updateUser(email, changes);

        return results;
    }

    @Delete('delete')
    async removeUser(@Query('email') email: string) : Promise<{}>{
        const results = await this.userService.deleteUser(email);

        return results;
    }

}
