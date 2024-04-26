import { Inject, Injectable, InjectionToken } from '@angular/core';
import { GenericService, ServiceConfig } from './generic.service';
import { EnvironmentDto } from 'app/shared/environment-dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const ENVIRONMENT_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'EnvironmentServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService extends GenericService<
  EnvironmentDto,
  EnvironmentDto,
  EnvironmentDto
> {
  constructor(
    protected override httpClient: HttpClient,
    @Inject(ENVIRONMENT_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }

  getEnvironment(): Observable<EnvironmentDto> {
    return this.httpClient.get<EnvironmentDto>(
      `${this.baseUrl}${this.resourceEndpoint}`
    );
  }

  updateEnvironment(environment: EnvironmentDto): Observable<EnvironmentDto> {
    return this.httpClient.put<EnvironmentDto>(
      `${this.baseUrl}${this.resourceEndpoint}`,
      environment
    );
  }
}
