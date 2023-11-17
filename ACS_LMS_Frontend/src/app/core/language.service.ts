import { Inject, Injectable, InjectionToken } from '@angular/core';
import { GenericService, ServiceConfig } from './generic.service';
import { Language } from 'app/shared/language';
import { HttpClient } from '@angular/common/http';

export const LANGUAGE_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'LanguageServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class LanguageService extends GenericService<
  Language,
  Language,
  Language
> {
  constructor(
    protected override httpClient: HttpClient,
    @Inject(LANGUAGE_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }
}
