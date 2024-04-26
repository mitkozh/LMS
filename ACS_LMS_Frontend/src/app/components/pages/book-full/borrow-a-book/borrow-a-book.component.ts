import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'app/core/book.service';
import { CheckoutService } from 'app/core/checkout.service';
import { BookFullDto } from 'app/shared/book-full-dto';
import { ReservationDto } from 'app/shared/reservation-dto';
import { of, switchMap, tap } from 'rxjs';

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
  @Input()
  id!: number;

  canReserve: boolean = false;
  reservation: ReservationDto | null = null;
  hasActiveCheckout: boolean = false;

  constructor(
    private bookService: BookService,
    private router: Router,
    private checkoutService: CheckoutService
  ) {}
  ngOnInit() {
    if (this.id) {
      this.checkoutService
        .checkActiveCheckout(this.id)
        .subscribe((response: boolean) => {
          this.hasActiveCheckout = response;
        });

      this.bookService
        .hasReservationForBook(this.id)
        .pipe(
          tap((reservation: ReservationDto) => {
            if (reservation) {
              this.canReserve = false;
              this.reservation = reservation;
            }
          }),
          switchMap((reservation: ReservationDto) =>
            !reservation
              ? this.bookService.checkAvailableBooks(this.id)
              : of(null)
          )
        )
        .subscribe((response: boolean | null) => {
          if (response !== null) {
            this.canReserve = response;
            console.log(this.canReserve);
          }
        });
    }
  }

  reserveBook() {
    if (this.id && !this.reservation) {
      this.bookService
        .reserveBook(this.id)
        .subscribe((response: ReservationDto) => {
          if (response) {
            this.canReserve = false;
            this.reservation = response;
          }
        });
    }
  }
}
