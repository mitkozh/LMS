import { BookShortDto } from "./book-short-dto";

export interface CategoryAddDto{
    name: string;
    description?: string;
    books?: BookShortDto[];
}