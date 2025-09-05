import { Body, Controller, Get, Post } from "@nestjs/common";
import { BookService } from "./books.service";
import { Book } from "./dto/book.tdo";
@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService
    ) {}

    @Get('all')
    async getAll() {
        return await this.bookService.getAll();
    }

    @Post('create')
    async createBook(@Body() book: Book){
        return await this.bookService.create(book);
    }

    @Get('byName')
    async getBookByName(@Body('name') name: string) {
        return await this.bookService.getByName(name)
    }
}