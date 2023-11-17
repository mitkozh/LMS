import { AcquisitionDocumentEnum } from "./acquasition-document-enum";
import { AuthorShortDto } from "./author-dto";
import { BookBindingEnum } from "./book-binding-enum";
import { Category } from "./category";

export interface BookFullDto {
    bookId: number;
    title: string;
    description: string;
    imageId: number;
    coverPhotoUrl: string;
    volume: number;
    authors: Set<AuthorShortDto>;
    categories: Set<Category>;
    bookCopyId: number;
    callNumber: string;
    inventoryNumber: string;
    price: number; 
    schoolInventoryNumber: string;
    language: string;
    languageName: string;
    publisherId: number;
    binding: BookBindingEnum;
    size: string;
    publicationDate: Date; 
    edition: string;
    isbn: string;
    notes: string;
    acquisitionDocument: AcquisitionDocumentEnum;
  }