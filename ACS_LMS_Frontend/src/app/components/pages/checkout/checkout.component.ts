import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'app/core/checkout.service';
import { CheckoutDto } from 'app/shared/checkout-dto';
import { CheckoutWithFineDto } from 'app/shared/checkout-with-fine-dto';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkouts: CheckoutWithFineDto[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  constructor(private checkoutService: CheckoutService) {}

  ngOnInit() {
    this.loading = true;
  }

  loadCheckouts(event: TableLazyLoadEvent) {
    this.loading = true;

    this.checkoutService
      .getAllActiveCheckouts(event.first!, event.rows!)
      .subscribe((res) => {
        this.checkouts = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      });
  }

  returnBook(id: number) {
    this.checkoutService.returnBook(id).subscribe(() => {
      this.loadCheckouts({ first: 0, rows: 10 });
    });
  }
}
