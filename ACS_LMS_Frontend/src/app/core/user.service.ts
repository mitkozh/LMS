import { Inject, Injectable, InjectionToken } from '@angular/core';
import { GenericService, ServiceConfig } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'app/shared/user';

export const USER_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'UserServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class UserService extends GenericService<User, User, User> {
  constructor(
    protected override httpClient: HttpClient,
    @Inject(USER_SERVICE_CONFIG) config: ServiceConfig
  ) {
    super(httpClient, config);
  }

  checkUserExist(email: string) {
    return this.httpClient.get<Boolean>(
      `${this.baseUrl}${this.resourceEndpoint}/check-user-exists/${email}`
    );
  }
}
