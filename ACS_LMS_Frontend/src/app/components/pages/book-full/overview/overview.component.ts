import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BookService } from 'app/core/book.service';
import { AuthorShortDto } from 'app/shared/author-dto';
import { BookFullDto } from 'app/shared/book-full-dto';
import { catchError, finalize } from 'rxjs';
import { BookInfoType } from '../book-full.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @Input() book: BookFullDto | undefined | null;
  @Input() title!: String;
  bookInfo: BookInfoType[] = [];
  isLoading = false;
  bookDescription: String | undefined;
  bookShortDescription: String | undefined;
  bookPhoto: SafeUrl | undefined;
  showFullDescription = false;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    if (!this.book) {
      this.isLoading = true;

      this.bookService
        .getBookFullByTitle(this.title)
        .pipe(
          catchError(() => {
            this.router.navigate(['/not-found']);
            return [];
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((book) => {
          this.setBookData(book);
        });
    } else {
      this.setBookData(this.book);
    }
  }

  private setBookData(book: BookFullDto): void {
    this.book = book;
    this.bookInfo = [
      { property: 'ISBN', value: book.isbn },
      { property: 'Page count', value: book.size },
      { property: 'Published', value: book.publicationDate },
      { property: 'Format', value: book.binding },
      { property: 'Publisher', value: book.publisherId },
      { property: 'Language', value: book.language },
      { property: 'Authors', value: this.getAuthorsHtml(book.authors) },
      { property: 'Volume', value: book.volume },
    ];

    this.bookDescription = book.description;
    this.bookShortDescription = this.bookDescription.substring(0, 300);

    if (this.bookDescription !== this.bookShortDescription) {
      this.bookShortDescription += '...';
    }
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  getAuthorsHtml(authors: Set<AuthorShortDto>) {
    const authorArray = [...authors];
    return authorArray
      .map((author) => `<a href="/author/${author.id}">${author.name}</a>`)
      .join(', ');
  }
}
