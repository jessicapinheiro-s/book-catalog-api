import { Test, TestingModule } from "@nestjs/testing";
import { BookService } from "./books.service";

import { Book } from "./dto/book.tdo";
import { PrismaService } from "src/prisma/prisma.service";

describe('BookService', () => {
    let service: BookService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BookService, PrismaService]
        }).compile();

        service = module.get<BookService>(BookService);
    });

    it('Should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('Should Create a Book', async() => {
        const bookData = {
            title: 'Teste',
            author: 'Jéssica Pinheiro',
            genre: 'Drama',
            status: 'Ativo'
        };
        const book: Book = await service.create(bookData);

        expect(book).toHaveProperty('id');
        expect(book.title).toBe('Teste');
    })
});