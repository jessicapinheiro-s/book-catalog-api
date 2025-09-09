import { Module } from '@nestjs/common';
import { DatabaseModule } from './prisma/prisma.database.module';
import { BookService } from './books/books.service';

@Module({
  imports: [DatabaseModule],
  providers: [BookService]
})
export class AppModule { }
