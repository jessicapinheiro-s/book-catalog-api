import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, ResetPasswordDto } from "./dto/auth-dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as crypto from 'crypto';
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async register(createUserDto: CreateUserDto) {
        const {
            name, email, password
        } = createUserDto;

        const userExists = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if (userExists) {
            throw new BadRequestException('E-mail already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                name, email, password: hashedPassword
            }
        });

        return {
            message: 'User created sucessfully',
            userId: user.id
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const {
            email, password
        } = loginUserDto;

        const userExists = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!userExists) {
            throw new UnauthorizedException('The user does not exist');
        } else {
            const isPasswordValid = await bcrypt.compare(password, userExists.password);

            if(!isPasswordValid) {
                throw new UnauthorizedException('The password is incorrect');
            }
            const payload = {
                sub: userExists.id,
                email: userExists.email
            };
            const acessToken = this.jwtService.sign(payload);

            return {
                acessToken,
                user: {
                    id: userExists.id,
                    name: userExists.name,
                    email: userExists.email
                }
            }
        }
    }

    async generateResetToken(email: string) {
        const userExists = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!userExists) {
            throw new BadRequestException('User not found');
        }

        const token = crypto.randomBytes(32).toString('hex');

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);

        await this.prisma.passwordReset.create({
            data: {
                token,
                userId: userExists.id,
                expiresAt
            }
        });

        return token;
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const {
            token,
            newPassword
        } = resetPasswordDto;

        const tokenExists = await this.prisma.passwordReset.findUnique({
            where: { token }
        });

        if(!tokenExists) {
            throw new BadRequestException('The token is invalid or it is expired');
        }

        const newPasswordashed = bcrypt.hash(newPassword, 10);
        
        await this.prisma.user.update({
            where: {
                id: tokenExists.id,
                data: {
                    password: newPasswordashed
                }
            }
        });

        await this.prisma.passwordReset.delete({
            where: {
                token
            }
        });

        return {
            message: 'The password was redefined sucessfully'
        }
    }
}