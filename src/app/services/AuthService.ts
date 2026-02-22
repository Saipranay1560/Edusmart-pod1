import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:1930/api/auth'; // Match your Spring Boot port

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Save the token returned from your JwtAuthFilter logic
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  signup(userData: any): Observable<any> {
    // include credentials (cookies) in case backend uses session or CSRF cookies
    return this.http.post(`${this.apiUrl}/register`, userData, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
