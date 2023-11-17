import { AcquisitionDocumentEnum } from "app/shared/acquasition-document-enum";
import { BookBindingEnum } from "app/shared/book-binding-enum";
import { Language } from "app/shared/language";
import { Publisher } from "app/shared/publisher";

export interface BookCopyAddDto {
    bookId: number | null;
    callNumber: string;
    inventoryNumber: string;
    price: number | null; 
    schoolInventoryNumber: string | null;
    language: Language | null;
    publisher: Publisher | null;
    binding: BookBindingEnum | null;
    size: string | null;
    publicationDate: string | null; 
    edition: string;
    isbn: string;
    notes: string | null;
    acquisitionDocumentEnum: AcquisitionDocumentEnum | null;
  }
  