import { PrismaService } from "../prisma/prisma.service";
import { Book, BookUpdate } from '../../src/books/dto/book.tdo'
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

    async updateBookById(book: BookUpdate) {
        const ifBookExists = await this.prisma.book.findUnique({
            where: {
                id: book.id
            }
        });

        if (!ifBookExists) {
            throw new NotFoundException('This item does not exist')
        }

        await this.prisma.book.update({
            where: {
                id: book.id
            },
            data: {
                title: 'The coldest city',
                author: 'Jess',
                genre: 'Drama',
                status: 'Ativo'
            }
        });
    }

    async deleteBook(id: number) {
        const ifExists = await this.prisma.book.findUnique({
            where: {
                id: id
            }
        });

        if (!ifExists) {
            throw new NotFoundException('This item was not found')
        }

        await this.prisma.book.delete({
            where: {
                id: id
            }
        })
    }

    async returnByStatus(statusParam: string){
        return await this.prisma.book.findMany({
            where: {
                status: statusParam
            }
        });
    }
}