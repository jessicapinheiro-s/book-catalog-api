// src/books/books.service.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../app.module';
import 'dotenv/config';

describe('BookService - Integration', () => {
    let service: BookService;
    let prisma: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        prisma = module.get<PrismaService>(PrismaService);
        service = module.get<BookService>(BookService);

        await prisma.$connect(); // Conecta o PrismaClient
    });

    afterAll(async () => {
        await prisma.$disconnect(); // Desconecta ao final
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
    });

    it('should create a book', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'Jéssica',
                email: 'jessicasilva@gmail.com',
                password: '123456',
                books: {
                    create: []
                },
                PasswordReset: {
                    create: []
                }
            }
        });

        const book = await service.create({
            title: 'Cassandra',
            author: 'Jéssica Pinheiro',
            genre: 'Drama',
            status: 'Ativo',
            userId: user.id
        });

        expect(book).toHaveProperty('id');
        expect(book.title).toBe('Cassandra');
    });

    it('should return the book by the parameter name', async () => {
        const bookByName = await service.getByName('Cassandra');

        expect(bookByName.length).toBeGreaterThanOrEqual(1);
        expect(bookByName[0].title).toBe('Cassandra');
    });

    it('should return all available books', async () => {
        const allBooks = await service.getAll();

        //nesse caso espera um tamanho especifico porque já há itens na tabela
        expect(allBooks.length).toBeGreaterThanOrEqual(1);
    });
});
