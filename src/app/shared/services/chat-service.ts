import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url = 'https://car-ecommerce-api-v-axg5c5fxhfeydqdj.canadacentral-01.azurewebsites.net';
  //url = 'http://localhost:3000';
  private http = inject(HttpClient);
  
  // Observable para notificar cuando la sesión expire
  private sessionExpiredSubject = new Subject<void>();
  sessionExpired$ = this.sessionExpiredSubject.asObservable();

  callApi(message: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.url}/chat`, { message })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Notificar que la sesión ha expirado
            this.sessionExpiredSubject.next();
          }
          return throwError(() => error);
        })
      );
  }
}
