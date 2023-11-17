import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { InjectionToken } from '@angular/core';
import { API_URL } from './constants';
import { Observable } from 'rxjs';
import { GenericService, ServiceConfig } from './generic.service';
import { Author } from 'app/shared/author';
import { AuthorShortDto } from 'app/shared/author-dto';

export const AUTHOR_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'AuthorServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class AuthorService extends GenericService<Author, Author, AuthorShortDto> {
  constructor(
    protected override httpClient: HttpClient,
    @Inject(AUTHOR_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }

}
