import { Book } from "./book";

export interface Author {
  id: number;
  name: string;
  description: string;
  books: Book[];
}
