import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiUrl = 'https://rent-a-read-0jps.onrender.com/speech';  

  convertSpeechToText(formData: FormData) : Observable<any> {
    return this.http.post<{text : String}>((`${this.apiUrl}/convert`), formData);
  }
}
