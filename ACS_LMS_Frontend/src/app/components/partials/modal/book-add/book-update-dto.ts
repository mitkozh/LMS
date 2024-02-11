import { BookAddDto } from './book-add-dto';

export interface BookUpdateDto extends BookAddDto {
  bookId: number;
  bookCopyId: Number;
}
