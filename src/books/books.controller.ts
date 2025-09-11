import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { BookService } from "./books.service";
import { Book, BookUpdate } from "./dto/book.tdo";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService
    ) {}
    @UseGuards(JwtAuthGuard)

    @Get('all')
    async getAll() {
        return await this.bookService.getAll();
    }

    @Post('create')
    async createBook(@Body() book: Book){
        return await this.bookService.create(book);
    }

    @Get('byName')
    async getBookByName(@Query('name') name: string) {
        return await this.bookService.getByName(name)
    }

    @Patch('updateById')
    async updateBook(@Body() bookInfo: BookUpdate) {
        return await this.bookService.updateBookById(bookInfo)
    }

    @Delete('deleteById')
    async deleteBook(@Query() id: number){
        return await this.bookService.deleteBook(id);
    }

    @Get('getByStatus')
    async getByStatus(@Query() status: string){
        return await this.bookService.returnByStatus(status);
    }
}