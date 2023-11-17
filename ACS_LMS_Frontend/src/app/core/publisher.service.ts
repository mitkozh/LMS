import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { InjectionToken } from '@angular/core';
import { GenericService, ServiceConfig } from './generic.service';
import { Publisher } from 'app/shared/publisher';
import { AddPublisherDto } from 'app/components/partials/modal/add-publisher/add-publisher-dto';

export const PUBLISHER_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'PublisherServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class PublisherService extends GenericService<Publisher, AddPublisherDto, Publisher> {
  constructor(
    protected override httpClient: HttpClient,
    @Inject(PUBLISHER_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }

}
