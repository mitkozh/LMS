import { Author } from "./author";
import { Category } from "./category";

export interface Book {
  id: number;
  title: string;
  description: string;
  coverPhoto: string;
  volume: number;
  authors: Author[];
  categories: Category[];
}
