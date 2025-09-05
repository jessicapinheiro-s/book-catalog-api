import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, ResetPasswordDto } from "./dto/auth-dto";

@Controller('auth')
export class authController {
    constructor (private readonly authService: AuthService) {};

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto){
        return this.authService.register(createUserDto);

    }

    @Post('login')
    async login (@Body() createUserData: CreateUserDto) {
        return this.authService.login(createUserData)
    }

    @Post('forgot-password')
    async logout (@Body('emai') email: string){
        const token = this.authService.generateResetToken(email);
        return {
            message: 'The token was sent to the e-mail adress'
        }
    }

    @Post('reset-password')
    async resetPassword(@Body() body: ResetPasswordDto) {
        return this.authService.resetPassword(body);
    }
    
}