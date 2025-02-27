import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OwnerStats {
  totalBooks: number;
  totalRentals: number;
  activeRentals: number;
  revenue: number;
}

export interface Rental {
  _id: string;
  book_id: string;
  user_id: string;
  start_date: Date;
  end_date: Date;
  status: string;
  amount: number;
  book_details?: {
    title: string;
    author: string;
    cover_image: string;
  };
  user_details?: {
    username: string;
    email: string;
  };
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genres: string[];
  price_per_hour: number;
  cover_image: string;
  file_url?: string;
  owner_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
    private apiUrl = environment.apiUrl;
    
    constructor(private http: HttpClient) {}

    getStats(): Observable<OwnerStats> {
        return this.http.get<OwnerStats>(`${this.apiUrl}/owner/stats`)
          .pipe(catchError(this.handleError('getStats')));
    }

    getRecentRentals(): Observable<Rental[]> {
        return this.http.get<Rental[]>(`${this.apiUrl}/owner/recent-rentals`)
          .pipe(catchError(this.handleError('getRecentRentals')));
    }

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(`${this.apiUrl}/owner/books`)
          .pipe(catchError(this.handleError('getBooks')));
    }

    addBook(book: FormData): Observable<Book> {
        return this.http.post<Book>(`${this.apiUrl}/owner/book`, book)
          .pipe(catchError(this.handleError('addBook')));
    }

    updateBook(book_id: string, book: FormData): Observable<Book> {
        return this.http.put<Book>(`${this.apiUrl}/owner/book/${book_id}`, book)
          .pipe(catchError(this.handleError('updateBook')));
    }

    deleteBook(bookId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/owner/book/${bookId}`)
          .pipe(catchError(this.handleError('deleteBook')));
    }

    getRentalsByOwner(): Observable<Rental[]> {
        return this.http.get<Rental[]>(`${this.apiUrl}/owner/rentals`)
          .pipe(catchError(this.handleError('getRentalsByOwner')));
    }

    uploadCoverImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
      
        return this.http.post<any>(`${this.apiUrl}/owner/upload-cover-image`, formData)
          .pipe(catchError(this.handleError('uploadCoverImage')));
    }
    
    private handleError(operation = 'operation') {
      return (error: any): Observable<any> => {
        console.error(`${operation} failed: ${error.message}`);
        return throwError(() => new Error(`${operation} failed: ${error.message}`));
      };
    }
}
