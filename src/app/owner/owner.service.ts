import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

    private apiUrl = 'http://127.0.0.1:5000/';

    constructor(private http: HttpClient) {}

    getStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/owner/stats`);
    }

    getRecentRentals(): Observable<any> {
        return this.http.get(`${this.apiUrl}/owner/recent-rentals`);
    }


    getBooks(): Observable<any> {
        return this.http.get(`${this.apiUrl}/owner/books`);
    }

    addBook(book: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/owner/book`, book);
    }

    updateBook(book_id: any, book: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}/owner/book/${book_id}`, book);
    }

    deleteBook(bookId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/owner/book/${bookId}`);
    }

    getRentalsByOwner() {
        return this.http.get(`${this.apiUrl}/owner/rentals`);
    }

    uploadCoverImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);
      
        return this.http.post(`${this.apiUrl}/owner/upload-cover-image`, formData);
      }
      

}
