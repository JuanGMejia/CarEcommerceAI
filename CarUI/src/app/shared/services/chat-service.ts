import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);

  callApi() {
    this.http.post('http://localhost:3000/chat', { message: 'Hello from UI' }).subscribe((result) => {
      console.log('API called successfully:', result);
    })
  }
}
