import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url = 'https://car-ecommerce-api-v-axg5c5fxhfeydqdj.canadacentral-01.azurewebsites.net';
  private http = inject(HttpClient);

  callApi(message: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.url}/chat`, { message });
  }
}
