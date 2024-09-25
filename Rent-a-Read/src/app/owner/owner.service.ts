import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

    private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/owner/stats`);
  }

  getRecentRentals(): Observable<any> {
    return this.http.get(`${this.apiUrl}/owner/recent-rentals`);
  }
}
