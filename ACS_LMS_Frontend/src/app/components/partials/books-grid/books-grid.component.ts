import { Component, Input } from '@angular/core';
import { BookShortDto } from 'app/shared/book-short-dto';

@Component({
  selector: 'app-books-grid',
  templateUrl: './books-grid.component.html',
  styleUrls: ['./books-grid.component.scss']
})
export class BooksGridComponent {
  @Input()
  books: BookShortDto[] = [];

}
