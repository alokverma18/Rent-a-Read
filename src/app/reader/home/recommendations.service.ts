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

  private apiUrl = 'https://rent-a-read-0jps.onrender.com/recommend/';

  fetchRecommendations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
