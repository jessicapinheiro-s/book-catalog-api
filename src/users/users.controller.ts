import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller()
export class UsersControllers {
    constructor(
        private readonly userservice: UserService
    ) { }
    
    @UseGuards(JwtAuthGuard)

    @Get('allUsers')
    async allUsers() {
        return await this.userservice.getAllUsers();
    }
}