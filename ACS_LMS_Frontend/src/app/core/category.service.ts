import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { InjectionToken } from '@angular/core';
import { API_URL } from './constants';
import { Observable } from 'rxjs';
import { GenericService, ServiceConfig } from './generic.service';
import { Category } from 'app/shared/category';
import { CategoryAddDto } from 'app/shared/category-add-dto';
import { CategoryWithBooks } from 'app/shared/category-with-books';

export const CATEGORY_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'CategoryServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends GenericService<Category, CategoryAddDto, CategoryWithBooks> {
  constructor(
    protected override httpClient: HttpClient,
    @Inject(CATEGORY_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }

}
