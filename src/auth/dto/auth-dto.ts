import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

export class ResetPasswordDto {
    token: string;
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;
}