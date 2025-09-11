import { Controller, Get } from "@nestjs/common";
import { UserService } from "./users.service";

@Controller()
export class UsersControllers {
    constructor(
        private readonly userservice: UserService
    ) { }
    @Get('allUsers')
    async allUsers() {
        return await this.userservice.getAllUsers();
    }
}