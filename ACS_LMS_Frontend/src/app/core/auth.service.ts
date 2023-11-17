import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(
    credentials: Partial<{ username: null; password: null }>
  ): Observable<any> {
    const formData = new FormData();
    formData.append('username', credentials.username!);
    formData.append('password', credentials.password!);

    return this.http.post('http://localhost:9000/' + 'login', formData);
  }

  
}
