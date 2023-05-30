import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './dtos/user.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
    constructor(private readonly userService: UserService){}

    @Post('create')
    @Roles(Role.Admin)
    @UsePipes(new ValidationPipe())
    async addNewAdmin(@Body() body: User){
        const generatedId = await this.userService.createAdmin(body);

        return {id: generatedId};
    }

    @Get('')
    @Roles(Role.Admin)
    async getAllAdmins() : Promise<User[]>{
        const admins = await this.userService.findAdmins();

        return admins;
    }
}
