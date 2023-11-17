import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'app/core/book.service';
import { BookFullDto } from 'app/shared/book-full-dto';
import { BookShortDto } from 'app/shared/book-short-dto';

@Component({
  selector: 'app-more-by-author',
  templateUrl: './more-by-author.component.html',
  styleUrls: ['./more-by-author.component.scss'],
})
export class MoreByAuthorComponent implements OnInit {
  @Input() authors!: number[];
  books: BookShortDto[] | undefined;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.bookService
      .getBooksByAuthorsIds(this.authors)
      .subscribe((booksRecieved) => {
        if (booksRecieved && booksRecieved.length > 0) {
          this.books = booksRecieved;
        }
      });
  }
}
