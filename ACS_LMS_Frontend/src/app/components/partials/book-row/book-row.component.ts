import { Component, Input } from '@angular/core';
import { BookShortDto } from '../../../shared/book-short-dto';

@Component({
  selector: 'app-book-row',
  templateUrl: './book-row.component.html',
  styleUrls: ['./book-row.component.scss']
})
export class BookRowComponent {
  @Input()
  books: BookShortDto[] = [];

}
