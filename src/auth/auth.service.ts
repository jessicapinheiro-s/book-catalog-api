import { BadRequestException, Injectable, UnauthorizedException, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, ResetPasswordDto } from "./dto/auth-dto";
import { PrismaService } from "../prisma/prisma.service";
import * as crypto from 'crypto';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async register(createUserDto: CreateUserDto) {
        const { name, email, password } = createUserDto;

        try {
            this.logger.log(`Checking if user exists with email: ${email}`);
            const userExists = await this.prisma.user.findUnique({ where: { email } });
            if (userExists) {
                this.logger.error(`Registration failed: Email already registered - ${email}`);
                throw new BadRequestException('E-mail already registered');
            }

            this.logger.log(`Hashing password for user: ${email}`);
            const hashedPassword = await bcrypt.hash(password, 10);

            this.logger.log(`Creating user in database: ${email}`);
            const user = await this.prisma.user.create({
                data: { name, email, password: hashedPassword }
            });

            this.logger.log(`User created successfully: ${user.id} - ${user.email}`);
            return {
                message: 'User created successfully',
                userId: user.id
            };
        } catch (error) {
            this.logger.error(`Failed to register user: ${email}`, error.stack);
            throw new InternalServerErrorException('Could not register user');
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        try {
            this.logger.log(`Checking if user exists for login: ${email}`);
            const userExists = await this.prisma.user.findUnique({ where: { email } });
            if (!userExists) {
                this.logger.error(`Login failed: User does not exist - ${email}`);
                throw new UnauthorizedException('The user does not exist');
            }

            this.logger.log(`Comparing passwords for user: ${email}`);
            const isPasswordValid = await bcrypt.compare(password, userExists.password);
            if (!isPasswordValid) {
                this.logger.error(`Login failed: Incorrect password for user - ${email}`);
                throw new UnauthorizedException('The password is incorrect');
            }

            const payload = { sub: userExists.id, email: userExists.email };
            const accessToken = this.jwtService.sign(payload);

            this.logger.log(`User logged in successfully: ${email}`);
            return {
                accessToken,
                user: { id: userExists.id, name: userExists.name, email: userExists.email }
            };
        } catch (error) {
            this.logger.error(`Login error for user: ${email}`, error.stack);
            throw new InternalServerErrorException('Could not login user');
        }
    }

    async generateResetToken(email: string) {
        try {
            this.logger.log(`Checking if user exists for reset token: ${email}`);
            const userExists = await this.prisma.user.findUnique({ where: { email } });
            if (!userExists) {
                this.logger.error(`Reset token generation failed: User not found - ${email}`);
                throw new BadRequestException('User not found');
            }

            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 30);

            await this.prisma.passwordReset.create({
                data: { token, userId: userExists.id, expiresAt }
            });

            this.logger.log(`Reset token generated successfully for user: ${email}`);
            return token;
        } catch (error) {
            this.logger.error(`Failed to generate reset token for user: ${email}`, error.stack);
            throw new InternalServerErrorException('Could not generate reset token');
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;

        try {
            this.logger.log(`Validating reset token: ${token}`);
            const tokenExists = await this.prisma.passwordReset.findUnique({ where: { token } });
            if (!tokenExists) {
                this.logger.error(`Invalid or expired reset token: ${token}`);
                throw new BadRequestException('The token is invalid or expired');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            this.logger.log(`Updating password for userId: ${tokenExists.userId}`);
            await this.prisma.user.update({
                where: { id: tokenExists.userId },
                data: { password: hashedPassword }
            });

            await this.prisma.passwordReset.delete({ where: { token } });

            this.logger.log(`Password reset successfully for userId: ${tokenExists.userId}`);
            return { message: 'The password was redefined successfully' };
        } catch (error) {
            this.logger.error(`Failed to reset password with token: ${token}`, error.stack);
            throw new InternalServerErrorException('Could not reset password');
        }
    }

    async getAuthUser(context) {
        const { id } = context;
        try {
            this.logger.log(`Fetching authenticated user with id: ${id}`);
            const userExists = await this.prisma.user.findUnique({ where: { id } });
            if (!userExists) {
                this.logger.error(`Authenticated user not found: ${id}`);
                throw new NotFoundException('User not found');
            }

            this.logger.log(`Authenticated user fetched successfully: ${id}`);
            return userExists;
        } catch (error) {
            this.logger.error(`Failed to fetch authenticated user: ${id}`, error.stack);
            throw new InternalServerErrorException('Could not fetch authenticated user');
        }
    }
}
