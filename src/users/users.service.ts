import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(private readonly prisma: PrismaService) {}

    async getAllUsers() {
        try {
            this.logger.log('Fetching all users from database');
            const users = await this.prisma.user.findMany();
            this.logger.log(`Fetched ${users.length} users successfully`);
            return users;
        } catch (error) {
            this.logger.error('Failed to fetch all users', error.stack);
            throw new InternalServerErrorException('Could not fetch users');
        }
    }
}
