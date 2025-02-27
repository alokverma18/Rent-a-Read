import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SpeechToTextResponse {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  constructor(
    private http: HttpClient,
  ) { }

  private apiUrl = `${environment.apiUrl}/speech`;  

  convertSpeechToText(formData: FormData): Observable<SpeechToTextResponse> {
    return this.http.post<SpeechToTextResponse>(`${this.apiUrl}/convert`, formData)
      .pipe(
        catchError(this.handleError('convertSpeechToText'))
      );
  }

  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }
}
