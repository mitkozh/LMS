import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { InjectionToken } from '@angular/core';
import { API_URL } from './constants';

export interface ServiceConfig {
  resourceEndpoint: string;
}

export const SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'ServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class GenericService<TModel, TDtoAdd, TDtoRecieve> {
  protected readonly baseUrl: string;
  protected readonly resourceEndpoint: string;

  constructor(
    protected httpClient: HttpClient,
    @Inject(SERVICE_CONFIG) config: ServiceConfig
  ) {
    this.baseUrl = API_URL;
    this.resourceEndpoint = config.resourceEndpoint;
  }

  getList() {
    return this.httpClient.get<TModel[]>(
      `${this.baseUrl}${this.resourceEndpoint}`
    );
  }

  getResultsDtoByName(name: string) {
    return this.httpClient.get<TDtoRecieve[]>(
      `${this.baseUrl}${this.resourceEndpoint}/all/${name}`
    );
  }

  getListDto() {
    return this.httpClient.get<TDtoRecieve[]>(
      `${this.baseUrl}${this.resourceEndpoint}`
    );
  }

  getById(id: number) {
    return this.httpClient.get<TModel>(
      `${this.baseUrl}${this.resourceEndpoint}/${id}`
    );
  }

  getByIdAndRecieveDto(id: number) {
    return this.httpClient.get<TDtoRecieve>(
      `${this.baseUrl}${this.resourceEndpoint}/${id}`
    );
  }

  getByName(name: string) {
    return this.httpClient.get<TModel>(
      `${this.baseUrl}${this.resourceEndpoint}/name/${name}`
    );
  }

  getByNameDto(name: string) {
    return this.httpClient.get<TDtoRecieve>(
      `${this.baseUrl}${this.resourceEndpoint}/name/${name}`
    );
  }

  add(dto: TDtoAdd) {
    return this.httpClient.post<TModel>(
      `${this.baseUrl}${this.resourceEndpoint}`,
      dto
    );
  }

  addAndRecieveDto(dto: TDtoAdd) {
    return this.httpClient.post<TDtoRecieve>(
      `${this.baseUrl}${this.resourceEndpoint}`,
      dto
    );
  }

  update(dto: TDtoAdd) {
    return this.httpClient.put<TModel>(
      `${this.baseUrl}${this.resourceEndpoint}`,
      dto
    );
  }

  updateAndThenRecieveDto(id: number, dto: TDtoAdd) {
    return this.httpClient.patch<TDtoRecieve>(
      `${this.baseUrl}${this.resourceEndpoint}/${id}`,
      dto
    );
  }

  remove(id: number) {
    return this.httpClient.delete<boolean>(
      `${this.baseUrl}${this.resourceEndpoint}/${id}`
    );
  }
}
