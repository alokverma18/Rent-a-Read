import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genres: string[];
  price_per_hour: number;
  cover_image: string;
  file_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`)
      .pipe(
        catchError(this.handleError('getBooks'))
      );
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`)
      .pipe(
        catchError(this.handleError(`getBookById id=${id}`))
      );
  }

  getRentals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rentals`)
      .pipe(
        catchError(this.handleError('getRentals'))
      );
  }

  rentBook(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rentals/add`, orderData)
      .pipe(
        catchError(this.handleError('rentBook'))
      );
  }

  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }
}
