import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './constants';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = API_URL;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    console.log(formData);

    return this.http.post<any>(`${this.apiUrl}images/upload`, formData);
  }

  getUploadImageUrl(): string{
    return (`${this.apiUrl}images/upload`);
  }

  getImageDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}images/info/${id}`);
  }

  getImage(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}images/${id}`, {
      responseType: 'blob',
    });
  }

  
}
