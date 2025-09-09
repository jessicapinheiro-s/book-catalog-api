import { PrismaService } from "../prisma/prisma.service";
import { Book } from '../../src/books/dto/book.tdo'
import { BadRequestException, Injectable } from "@nestjs/common";
@Injectable()
export class BookService {
    constructor(
        private readonly prisma: PrismaService,
    ) { };

    async create(book: Book) {
        const bookExists = await this.prisma.book.findFirst({
            where: {
                title: book.title
            }
        });

        if (bookExists) {
            throw new BadRequestException('This book already exists');
        }

        
        const bookCreated = await this.prisma.book.create({
            data: {
                title: book.title,
                author: book.author,
                genre: book.genre,
                status: book.status,
                userId: book.userId, // se houver relacionamento
            }
        });

        return bookCreated;
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