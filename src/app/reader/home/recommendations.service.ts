import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = 'http://127.0.0.1:5000/recommend/';

  fetchRecommendations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
