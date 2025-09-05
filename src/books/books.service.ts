import { PrismaService } from "src/prisma/prisma.service";
import { Book } from '../../src/books/dto/book.tdo'
import { BadRequestException } from "@nestjs/common";
export class BookService {
    constructor(
        private prisma: PrismaService,
    ) { };

    async create(book: Book) {
        const bookExists = await this.prisma.book.findUnique({
            where: {
                title: book.title
            }
        });

        if (bookExists) {
            throw new BadRequestException('This book already exists');
        }

        await this.prisma.book.create({
            data: {
                book
            }
        })
    }

    async getAll() {
        const allBooks = await this.prisma.book.findMany();
        return allBooks;
    }

    async getByName(name: string) {
        return await this.prisma.book.findMany({
            where: {
                title: name
            }
        })
    }
}