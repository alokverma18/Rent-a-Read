import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiUrl = environment.apiUrl;  

  convertSpeechToText(formData: FormData) : Observable<any> {
    return this.http.post<{text : String}>((`${this.apiUrl}/speech/convert`), formData);
  }
}
