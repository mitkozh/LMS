import { Inject, Injectable, InjectionToken } from '@angular/core';
import { GenericService, ServiceConfig } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { AddRentOutDto } from 'app/components/partials/modal/rent-out/add-rent-out-dto';
import { CheckoutDto } from '../shared/checkout-dto';

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
  constructor(
    protected override httpClient: HttpClient,
    @Inject(CHECKOUT_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }

  checkActiveCheckout(bookId: string) {
    return this.httpClient.get<Boolean>(
      `${this.baseUrl}${this.resourceEndpoint}/check-active-checkout/${bookId}`
    );
  }
}
