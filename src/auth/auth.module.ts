import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { Module } from '@nestjs/common';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '1hr'
            }
        })
    ],
    providers: [AuthService],
})

export class AuthModule {};