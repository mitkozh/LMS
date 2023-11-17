import { AcquisitionDocumentEnum } from "app/shared/acquasition-document-enum";
import { Author } from "app/shared/author";
import { AuthorShortDto } from "app/shared/author-dto";
import { BookBindingEnum } from "app/shared/book-binding-enum";
import { Category } from "app/shared/category";
import { Language } from "app/shared/language";
import { Publisher } from "app/shared/publisher";

export interface BookAddDto {
  title: string;
  description: string;
  coverPhotoName: string;
  volume: number;
  authors: number[];
  categories: string[];
  callNumber: string;
  inventoryNumber: string;
  price: number | null; 
  schoolInventoryNumber: string | null;
  language: Language | null;
  publisher: number | null;
  binding: BookBindingEnum | null;
  size: string | null;
  publicationDate: string | null; 
  edition: string;
  isbn: string;
  notes: string | null;
  acquisitionDocumentEnum: AcquisitionDocumentEnum | null;
}
