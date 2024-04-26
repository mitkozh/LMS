import { Component, OnInit } from '@angular/core';
import { BookService } from 'app/core/book.service';
import { BookShortDto } from 'app/shared/book-short-dto';

@Component({
  selector: 'app-borrowed-books',
  templateUrl: './borrowed-books.component.html',
  styleUrls: ['./borrowed-books.component.scss'],
})
export class BorrowedBooksComponent implements OnInit {
  constructor(private bookService: BookService) {}
  books: BookShortDto[] = new Array<BookShortDto>();

  ngOnInit(): void {
    this.bookService.getActiveCheckoutsForUser().subscribe((books) => {
      this.books = books;
    });
  }
}
