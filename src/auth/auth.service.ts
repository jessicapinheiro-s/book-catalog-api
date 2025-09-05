import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService
    ){}

    async register(createUserDto: CreateUserDto){
        const {
            name, email, password
        } = createUserDto;

        const userExists = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if(userExists){
            throw new Error('E-mail already registered');
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
}