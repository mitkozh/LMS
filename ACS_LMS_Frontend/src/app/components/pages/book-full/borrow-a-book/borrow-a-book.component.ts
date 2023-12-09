import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'app/core/book.service';
import { BookFullDto } from 'app/shared/book-full-dto';
import { ReservationDto } from 'app/shared/reservation-dto';

@Component({
  selector: 'app-borrow-a-book',
  templateUrl: './borrow-a-book.component.html',
  styleUrls: ['./borrow-a-book.component.scss'],
})
export class BorrowABookComponent implements OnInit {
  @Input()
  book: BookFullDto | undefined | null;
  @Input()
  title!: string;

  canReserve: boolean = false;
  reservation: ReservationDto | null = null;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit() {
    if (this.book) {
      this.bookService
        .checkAvailableBooks(this.book.bookId)
        .subscribe((response: boolean) => {
          this.canReserve = response;
          if (this.canReserve && this.book) {
            this.bookService
              .hasReservationForBook(this.book.bookId)
              .subscribe((reservation: ReservationDto) => {
                if (reservation) {
                  this.canReserve = false;
                  this.reservation = reservation;
                }
              });
          }
        });
    }
  }

  reserveBook() {
    if (this.book && !this.reservation) {
      this.bookService
        .reserveBook(this.book.bookId)
        .subscribe((response: ReservationDto) => {
          if (response) {
            this.canReserve = false;
            this.reservation = response;
          }
        });
    }
  }
}
