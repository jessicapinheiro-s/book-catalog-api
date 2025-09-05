import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUserDto, ResetPasswordDto } from "./dto/auth-dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as crypto from 'crypto';
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService
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

    async login(createUserDto: CreateUserDto) {
        const {
            name, email, password
        } = createUserDto;

        const userExists = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!userExists) {
            throw new Error('E-mail already registered');
        } else {
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