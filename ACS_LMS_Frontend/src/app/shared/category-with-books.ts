import { BookShortDto } from './book-short-dto';

export interface CategoryWithBooks{
    name: string;
    description?: string;
    books: BookShortDto[];
}