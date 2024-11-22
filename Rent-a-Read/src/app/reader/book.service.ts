import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://rent-a-read.onrender.com/';  

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/books`);
  }

  getBookById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/books/${id}`);
  }

  getRentals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rentals`);
  }

  rentBook(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rentals/add`, orderData);
  }


}
