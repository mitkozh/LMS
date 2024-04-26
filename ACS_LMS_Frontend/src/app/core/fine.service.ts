import { Inject, Injectable, InjectionToken } from '@angular/core';
import { GenericService, ServiceConfig } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_SERVICE_CONFIG } from './environment.service';
import { FineDto } from 'app/shared/fine-dto';
import { Observable } from 'rxjs';

export const FINE_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'FineServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class FineService extends GenericService<FineDto, FineDto, FineDto> {
  getFineCollectedThroughoutTheYear(): Observable<number> {
    return this.httpClient.get<number>(
      `${this.baseUrl}${this.resourceEndpoint}/fine-collected`
    );
  }
  constructor(
    protected override httpClient: HttpClient,
    @Inject(ENVIRONMENT_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }
}
