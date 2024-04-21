import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RentOutComponent } from 'app/components/partials/modal/rent-out/rent-out.component';
import { ReservationService } from 'app/core/reservation.service';
import { CheckoutDto } from 'app/shared/checkout-dto';
import { ReservationDto } from 'app/shared/reservation-dto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit {
  ref: DynamicDialogRef | undefined;
  private _searchTerm = '';
  reservations: ReservationDto[] = [];
  paginatedReservations: ReservationDto[] = [];
  onSubmitEntity$ = new EventEmitter<any>();
  //todo add checkout

  constructor(
    private reservationService: ReservationService,
    private dialogService: DialogService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.reservationService.getListDto().subscribe((reservations) => {
      this.reservations = reservations;
      this.updatePaginatedReservations();
    });
  }

  selectedReservation: ReservationDto | null = null;

  selectReservation(selectedReservation: ReservationDto) {
    this.selectedReservation = selectedReservation;
  }

  updatePaginatedReservations(startIndex = 0, rows = 10) {
    this.paginatedReservations = this.filteredReservations.slice(
      startIndex,
      startIndex + rows
    );
  }

  paginate(event: PaginatorState) {
    this.updatePaginatedReservations(event.first, event.rows);
  }

  get filteredReservations() {
    if (!this._searchTerm) {
      return this.reservations;
    }

    return this.reservations.filter(
      (reservation) =>
        reservation.bookName
          .toLowerCase()
          .includes(this._searchTerm.toLowerCase()) ||
        reservation.userEmail
          .toLowerCase()
          .includes(this._searchTerm.toLowerCase())
    );
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.updatePaginatedReservations();
  }

  get searchTerm() {
    return this._searchTerm;
  }

  rentOut(reservation: ReservationDto) {
    this.ref = this.dialogService.open(RentOutComponent, {
      header: 'Rent out book',
      width: 'min(600px, 60%)',
      height: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 30,
      draggable: true,
      closeOnEscape: false,
      data: {
        onSubmitEntity$: this.onSubmitEntity$,
        bookCopyId: reservation.bookCopyId,
        bookId: reservation.bookId,
        user: reservation.userEmail,
        reservationId: reservation.id,
      },
    });

    this.closeBooksEditModalOnSubmitted();
  }

  closeBooksEditModalOnSubmitted() {
    this.onSubmitEntity$.subscribe((checkout: CheckoutDto) => {
      if (checkout) {
        this.ref?.close();
        {
          if (checkout) {
          }
          this.ref?.close();
        }
      }
      this.router.navigate(['reservations']);
    });
  }
}
