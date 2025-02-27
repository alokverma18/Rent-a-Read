import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book } from '../../owner/owner.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {
  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = `${environment.apiUrl}/recommend`;

  fetchRecommendations(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError('fetchRecommendations'))
      );
  }

  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }
}
