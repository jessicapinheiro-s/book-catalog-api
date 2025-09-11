import { PrismaService } from "../prisma/prisma.service";
import { Book, BookUpdate } from '../../src/books/dto/book.tdo'
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from "@nestjs/common";

@Injectable()
export class BookService {
    private readonly logger = new Logger(BookService.name);

    constructor(private readonly prisma: PrismaService) { }

    async create(book: Book) {
        this.logger.log('Checking if the book already exists');

        const bookExists = await this.prisma.book.findFirst({ where: { title: book.title } });
        if (bookExists) {
            this.logger.error(`Book creation failed: "${book.title}" already exists`);
            throw new BadRequestException('This book already exists');
        }

        try {
            this.logger.log('Creating the book in the table');
            const bookCreated = await this.prisma.book.create({
                data: {
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    status: book.status,
                    userId: book.userId,
                }
            });
            this.logger.log(`Book created successfully: ${bookCreated.id} - ${bookCreated.title}`);
            return bookCreated;
        } catch (error) {
            this.logger.error(`Failed to create book: "${book.title}"`, error.stack);
            throw new InternalServerErrorException('Problems to create the book');
        }
    }

    async getAll() {
        try {
            this.logger.log('Searching for all books');
            const allBooks = await this.prisma.book.findMany();
            this.logger.log(`Fetched ${allBooks.length} books successfully`);
            return allBooks;
        } catch (error) {
            this.logger.error('Failed to fetch all books', error.stack);
            throw new InternalServerErrorException('Could not fetch books');
        }
    }

    async getByName(name: string) {
        try {
            const books = await this.prisma.book.findMany({ where: { title: name } });
            this.logger.log(`Found ${books.length} books with title: "${name}"`);
            return books;
        } catch (error) {
            this.logger.error(`Failed to fetch book by name: "${name}"`, error.stack);
            throw new InternalServerErrorException('Could not fetch the book by name');
        }
    }

    async updateBookById(book: BookUpdate) {
        try {
            this.logger.log(`Checking if the book exists with id: ${book.id}`);
            const ifBookExists = await this.prisma.book.findUnique({ where: { id: book.id } });
            if (!ifBookExists) {
                this.logger.error(`Book not found with id: ${book.id}`);
                throw new NotFoundException('This item does not exist');
            }

            this.logger.log(`Updating book with id: ${book.id}`);
            await this.prisma.book.update({
                where: { id: book.id },
                data: {
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    status: book.status
                }
            });
            this.logger.log(`Book updated successfully: ${book.id}`);
        } catch (error) {
            this.logger.error(`Failed to update book: ${book.id}`, error.stack);
            throw new InternalServerErrorException('Error updating the book');
        }
    }

    async deleteBook(id: number) {
        try {
            this.logger.log(`Checking if the book exists with id: ${id}`);
            const ifExists = await this.prisma.book.findUnique({ where: { id } });
            if (!ifExists) {
                this.logger.error(`Book not found with id: ${id}`);
                throw new NotFoundException('This item was not found');
            }

            this.logger.log(`Deleting book with id: ${id}`);
            await this.prisma.book.delete({ where: { id } });
            this.logger.log(`Book deleted successfully: ${id}`);
        } catch (error) {
            this.logger.error(`Failed to delete book: ${id}`, error.stack);
            throw new InternalServerErrorException('Could not delete the book');
        }
    }

    async returnByStatus(statusParam: string) {
        try {
            this.logger.log(`Fetching books with status: ${statusParam}`);
            const books = await this.prisma.book.findMany({ where: { status: statusParam } });
            this.logger.log(`Found ${books.length} books with status: ${statusParam}`);
            return books;
        } catch (error) {
            this.logger.error(`Failed to fetch books with status: ${statusParam}`, error.stack);
            throw new InternalServerErrorException('Could not fetch books by status');
        }
    }
}
