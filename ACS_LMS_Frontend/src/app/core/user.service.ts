import { Inject, Injectable, InjectionToken } from '@angular/core';
import { GenericService, ServiceConfig } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'app/shared/user';
import { Observable } from 'rxjs';

export const USER_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'UserServiceConfig'
);

@Injectable({
  providedIn: 'root',
})
export class UserService extends GenericService<User, User, User> {
  getCurrentUserInfo() {
    return this.httpClient.get<User>(`${this.baseUrl}${this.resourceEndpoint}`);
  }
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
  getAllUsers(offset: number, limit: number): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}${this.resourceEndpoint}/all?page=${
        offset / limit
      }&size=${limit}`
    );
  }

  updateUserWithRole(user: User): Observable<User> {
    return this.httpClient.put<User>(
      `${this.baseUrl}${this.resourceEndpoint}/update-with-role`,
      user
    );
  }

  updateUser(user: User) {
    return this.httpClient.put<User>(
      `${this.baseUrl}${this.resourceEndpoint}/${user.email}`,
      user
    );
  }
}
