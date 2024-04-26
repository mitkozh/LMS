import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from 'app/core/book.service';
import { ReservationService } from 'app/core/reservation.service';
import { IStatBoxData } from 'app/core/book.service';
import { CheckoutService } from 'app/core/checkout.service';
import { FineService } from 'app/core/fine.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  statBoxData: IStatBoxData[] = [];
  fineCollected: number = 0;
  booksRentingVsCheckingOutData: any;
  booksOverdueCountData: any;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    private bookService: BookService,
    private reservationService: ReservationService,
    private fineService: FineService,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.fetchReservations();
    this.fetchFineCollected();
  }

  ngOnDestroy(): void {}

  fetchData(): void {
    // const formattedStartDate = this.formatDate(this.startDate);
    // const formattedEndDate = this.formatDate(this.endDate);
    // this.checkoutService
    // .getBooksRentingVsBookCheckingOutDiagram(
    //   formattedStartDate,
    //   formattedEndDate
    // )
    // .subscribe((data: any) => {
    //   console.log(JSON.stringify(data));
    //   this.booksRentingVsCheckingOutData = {
    //     labels: Object.keys(data.Checkouts),
    //     datasets: [
    //       {
    //         label: 'Checkouts',
    //         data: Object.values(data.Checkouts),
    //         fill: false,
    //         borderColor: '#4bc0c0',
    //       },
    //       {
    //         label: 'Reservations',
    //         data: Object.values(data.Reservations),
    //         fill: false,
    //         borderColor: '#565656',
    //       },
    //     ],
    //   };
    // });
    // this.checkoutService
    //   .getBooksOverdueCount(formattedStartDate, formattedEndDate)
    //   .subscribe((data: any) => {
    //     this.booksOverdueCountData = {
    //       labels: Object.keys(data),
    //       datasets: [
    //         {
    //           data: Object.values(data),
    //           fill: false,
    //           borderColor: '#565656',
    //         },
    //       ],
    //     };
    //   });
  }

  fetchReservations(): void {
    this.reservationService
      .getBooksReservedLastWeek()
      .subscribe((data: number) => {
        this.statBoxData.push({
          label: 'Books Reserved Last Week',
          stat: data,
          change: 0,
          bgColor: '#f8f9fa',
          iconColor: '#dc3545',
          iconBgColor: '#ffffff',
        });
      });
  }

  fetchFineCollected(): void {
    this.fineService
      .getFineCollectedThroughoutTheYear()
      .subscribe((data: number) => {
        this.fineCollected = data;
      });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
