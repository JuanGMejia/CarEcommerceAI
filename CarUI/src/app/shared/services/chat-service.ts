import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);

  callApi(message: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('http://localhost:3000/chat', { message });
  }
}
