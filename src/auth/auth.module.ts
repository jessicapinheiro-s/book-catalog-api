import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { Module } from '@nestjs/common';
import { DatabaseModule } from "../prisma/prisma.database.module";
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '1hr'
            }
        }),
        DatabaseModule
    ],
    providers: [AuthService],
})

export class AuthModule {};