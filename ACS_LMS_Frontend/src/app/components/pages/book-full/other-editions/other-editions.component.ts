import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'app/core/book.service';
import { BookInfoType } from '../book-full.component';
import { BookFullDto } from 'app/shared/book-full-dto';

@Component({
  selector: 'app-other-editions',
  templateUrl: './other-editions.component.html',
  styleUrls: ['./other-editions.component.scss'],
})
export class OtherEditionsComponent implements OnInit {
  @Input()
  book: BookFullDto | undefined | null;
  @Input()
  title!: string;
  bookCopies: Number[] | undefined;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    console.log("test")
    this.bookService
      .getBookCopiesByTitle(this.title)
      .subscribe((copyIds: Number[]) => {
        // this.bookCopies = copyIds.filter(
        //   (copyId) => copyId !== this.book?.bookCopyId
        // );
        this.bookCopies = copyIds;
      });
  }
}
