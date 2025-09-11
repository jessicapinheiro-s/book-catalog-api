export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    books: Book[]
}

export class Book {
    id?: number;
    title: string;
    author: string;
    genre: string;
    status: string;
    userId: number;
    user?: User;
}
export class BookUpdate {
    id?: number;
    title?: string;
    author?: string;
    genre?: string;
    status?: string;
}