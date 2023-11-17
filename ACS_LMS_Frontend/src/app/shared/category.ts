import { Book } from "./book";

export interface Category {
  id: number;
  name: string;
  description:string;
  books: Book[];
}
