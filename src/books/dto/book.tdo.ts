import { IsNotEmpty, MinLength } from "class-validator";

export class User {
    id: number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    email: string;
    @MinLength(8)
    @IsNotEmpty()
    password: string;
    books: Book[]
}

export class Book {
    id?: number;
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    author: string;
    @IsNotEmpty()
    genre: string;
    @IsNotEmpty()
    status: string;
    @IsNotEmpty()
    userId: number;
    @IsNotEmpty()
    user?: User;
}
export class BookUpdate {
    @IsNotEmpty()
    id?: number;
    @IsNotEmpty()
    title?: string;
    @IsNotEmpty()
    author?: string;
    @IsNotEmpty()
    genre?: string;
    @IsNotEmpty()
    status?: string;
}