import { PrismaService } from "src/prisma/prisma.service";
import { BookService } from "./books.service";
import { BookController } from "./books.controller";
import { Module } from "@nestjs/common";

@Module({
    controllers: [BookController],
    providers: [BookService, PrismaService]
})

export class BookModukle {}