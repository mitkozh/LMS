import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { InjectionToken } from '@angular/core';
import { GenericService, ServiceConfig } from './generic.service';
import { ReservationDto } from 'app/shared/reservation-dto';

export const RESERVATION_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'ReservationServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class ReservationService extends GenericService<ReservationDto, ReservationDto, ReservationDto> {
  constructor(
    protected override httpClient: HttpClient,
    @Inject(RESERVATION_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }
}
