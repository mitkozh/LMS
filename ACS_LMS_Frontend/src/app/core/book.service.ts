export interface IStatBoxData {
  label: string;
  icon?: string;
  stat: number;
  change: number;
  bgColor: string;
  iconColor: string;
  iconBgColor: string;
}

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { InjectionToken } from '@angular/core';
import { API_URL } from './constants';
import { Observable, of } from 'rxjs';
import { Book } from 'app/shared/book';
import { BookAddDto } from 'app/components/partials/modal/book-add/book-add-dto';
import { BookShortDto } from 'app/shared/book-short-dto';
import { GenericService, ServiceConfig } from './generic.service';
import { BookFullDto } from 'app/shared/book-full-dto';
import { BookCopyAddDto } from 'app/components/partials/modal/add-book-copy/book-copy-add-dto';
import { ReservationDto as ReservationDto } from 'app/shared/reservation-dto';
import { BookUpdateDto } from 'app/components/partials/modal/book-add/book-update-dto';

export const BOOK_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'BookServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class BookService extends GenericService<
  Book,
  BookAddDto | BookUpdateDto,
  BookShortDto
> {
  findBookWithGoogleApiWithISBN(isbn: string): Observable<BookFullDto> {
    return this.httpClient.get<BookFullDto>(
      `${this.baseUrl}${this.resourceEndpoint}/get-book-with-google-api/isbn/${isbn}`
    );
  }
  deleteBookByBookIdAndBookCopyId(
    bookId: number,
    bookCopyId: number
  ): Observable<boolean> {
    return this.httpClient.delete<boolean>(
      `${this.baseUrl}${this.resourceEndpoint}/${bookId}/${bookCopyId}`
    );
  }
  checkForInventoryNumber(inventoryNumber: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.baseUrl}${this.resourceEndpoint}/check-inventory-number/${inventoryNumber}`
    );
  }
  checkForISBN(isbn: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.baseUrl}${this.resourceEndpoint}/check-isbn/${isbn}`
    );
  }

  checkForCallNumber(callNumber: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.baseUrl}${this.resourceEndpoint}/check-call-number/${callNumber}`
    );
  }

  getBooksByAuthorsIds(ids: number[]) {
    return this.httpClient.post<BookShortDto[]>(
      `${this.baseUrl}${this.resourceEndpoint}/authors`,
      ids
    );
  }
  constructor(
    protected override httpClient: HttpClient,
    @Inject(BOOK_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }

  hasReservationForBook(bookId: number): Observable<ReservationDto> {
    return this.httpClient.get<ReservationDto>(
      `${this.baseUrl}${this.resourceEndpoint}/has-reservations/${bookId}`
    );
  }

  getBestsellers() {
    return this.httpClient.get<BookShortDto[]>(
      `${this.baseUrl}${this.resourceEndpoint}/bestsellers`
    );
  }

  getBookFullByTitleAndId(title: String, id: Number) {
    return this.httpClient.get<BookFullDto>(
      `${this.baseUrl}${this.resourceEndpoint}/${title}/${id}`
    );
  }

  getBookFullByTitleAndIdAndBookCopyId(
    title: String,
    id: Number,
    bookCopyId: Number
  ) {
    return this.httpClient.get<BookFullDto>(
      `${this.baseUrl}${this.resourceEndpoint}/${title}/${id}/${bookCopyId}`
    );
  }

  getBookCopiesByTitleAndId(title: String, id: number) {
    return this.httpClient.get<Number[]>(
      `${this.baseUrl}${this.resourceEndpoint}/bookCopy/${title}/${id}`
    );
  }


  getFreeBookCopiesById(id: number) {
    return this.httpClient.get<Number[]>(
      `${this.baseUrl}${this.resourceEndpoint}/book/free-copy/${id}`
    );
  }

  addBookCopy(bookCopy: BookCopyAddDto) {
    return this.httpClient.post<BookFullDto>(
      `${this.baseUrl}${this.resourceEndpoint}/bookCopy`,
      bookCopy
    );
  }

  checkAvailableBooks(bookId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${this.baseUrl}${this.resourceEndpoint}/available-check/${bookId}`
    );
  }

  reserveBook(bookId: number): Observable<ReservationDto> {
    return this.httpClient.get<ReservationDto>(
      `${this.baseUrl}${this.resourceEndpoint}/reserveBook/${bookId}`
    );
  }

  override getList() {
    return super.getList();
  }

  fetchStatBoxData(): Observable<IStatBoxData[]> {
    const statBoxData: IStatBoxData[] = [
      {
        label: 'Borrowed books',
        icon: 'fa-solid fa-file-import',
        stat: 59,
        change: -2,
        bgColor: '#DAF1F4',
        iconColor: '#00ACB4',
        iconBgColor: '#AEDCE0',
      },
      {
        label: 'Overdue books',
        icon: 'fa-solid fa-file-excel',
        stat: 10,
        change: 3,
        bgColor: '#FFF4E6',
        iconColor: '#FCB449',
        iconBgColor: '#F9E1C3',
      },
      {
        label: 'Library Visitors',
        icon: 'fa-solid fa-users',
        stat: 102,
        change: 12,
        bgColor: '#FFFBE6',
        iconColor: '#D5C770',
        iconBgColor: '#F6EFC6',
      },
    ];

    return of(statBoxData);
  }
}
