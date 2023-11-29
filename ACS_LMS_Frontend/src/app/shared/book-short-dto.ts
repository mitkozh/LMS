import { SafeUrl } from "@angular/platform-browser";
import { AuthorShortDto } from "./author-dto";
import { BookBindingEnum } from "./book-binding-enum";

export interface BookShortDto {
    id: number;
    title: string;
    imageId: number;
    authors: AuthorShortDto[];
    coverPhoto?: SafeUrl;
  }
  