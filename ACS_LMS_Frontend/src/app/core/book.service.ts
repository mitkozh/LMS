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

export const BOOK_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'BookServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class BookService extends GenericService<
  Book,
  BookAddDto,
  BookShortDto
> {

  
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

  getBestsellers() {
    return this.httpClient.get<BookShortDto[]>(
      `${this.baseUrl}${this.resourceEndpoint}/bestsellers`
    );
  }

  getBookFullByTitle(title: String) {
    return this.httpClient.get<BookFullDto>(
      `${this.baseUrl}${this.resourceEndpoint}/${title}`
    );
  }

  getBookFullByTitleAndEdition(title: String, edition: Number) {
    return this.httpClient.get<BookFullDto>(
      `${this.baseUrl}${this.resourceEndpoint}/${title}/${edition}`
    );
  }

  getBookCopiesByTitle(title: String) {
    return this.httpClient.get<Number[]>(
      `${this.baseUrl}${this.resourceEndpoint}/bookCopy/${title}`
    );
  }

  addBookCopy(bookCopy: BookCopyAddDto) {
    return this.httpClient.post<BookFullDto>(
      `${this.baseUrl}${this.resourceEndpoint}/bookCopy`,
      bookCopy
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

    // Simulate fetching data from API
    // Replace the code below with your actual API call
    // return this.http.get<IStatBoxData[]>('your-api-endpoint');
    return of(statBoxData);
  }
}
