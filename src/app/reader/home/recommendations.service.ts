import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = environment.apiUrl;

  fetchRecommendations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recommend/`);
  }
}
