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

  private apiUrl = 'http://127.0.0.1:5000/speech';  

  convertSpeechToText(formData: FormData) : Observable<any> {
    return this.http.post<{text : String}>((`${this.apiUrl}/convert`), formData);
  }
}
