export class CreateUserDto {
    email: string;
    name: string;
    password: string;
}

export class LoginUserDto {
    email: string;
    password: string;
}

export class ResetPasswordDto {
    token: string;
    newPassword: string;
}