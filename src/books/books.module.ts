import { PrismaService } from "../prisma/prisma.service";
import { BookService } from "./books.service";
import { BookController } from "./books.controller";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../prisma/prisma.database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [BookController],
    providers: [BookService, PrismaService]
})

export class BookModukle { }