import { Inject, Injectable, InjectionToken } from '@angular/core';
import { GenericService, ServiceConfig } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { AddRentOutDto } from 'app/components/partials/modal/rent-out/add-rent-out-dto';
import { CheckoutDto } from '../shared/checkout-dto';
import { Observable } from 'rxjs';

export const CHECKOUT_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'UserServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class CheckoutService extends GenericService<
  CheckoutDto,
  AddRentOutDto,
  CheckoutDto
> {
  returnBook(id: number): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}${this.resourceEndpoint}/${id}/return`,
      {}
    );
  }

  getAllActiveCheckouts(offset: number, limit: number): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}${this.resourceEndpoint}?page=${
        offset / limit
      }&size=${limit}`
    );
  }
  constructor(
    protected override httpClient: HttpClient,
    @Inject(CHECKOUT_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }

  checkActiveCheckout(bookId: number) {
    return this.httpClient.get<boolean>(
      `${this.baseUrl}${this.resourceEndpoint}/check-active-checkout/${bookId}`
    );
  }

  getBooksRentingVsBookCheckingOutDiagram(startDate: string, endDate: string): Observable<Map<string, Map<string, number>>> {
    return this.httpClient.get<Map<string, Map<string, number>>>(`${this.baseUrl}${this.resourceEndpoint}/books-renting-vs-checking-out`, {
      params: {
        startDate,
        endDate
      }
    });
}

  getBooksOverdueCount(startDate: string, endDate: string): Observable<Map<string, number>> {
    return this.httpClient.get<Map<string, number>>(`${this.baseUrl}${this.resourceEndpoint}/books-overdue-count`, {
      params: {
        startDate,
        endDate
      }
    });
  }

  getBooksCheckedOutLastWeek(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}${this.resourceEndpoint}/books-checked-out-last-week`);
  }

}
