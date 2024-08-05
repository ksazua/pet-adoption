import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.pet-adoption.amauta.education/api';
  /*private apiUrl = 'http://localhost:3003/api';*/

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      catchError(error => {
        console.error('Login error:', error);
        return of(null); // Devuelve null en caso de error
      })
    );
  }

  getCurrentUser(email: string): Observable<any> {
    if (email) {
      return this.http.post<any>(`${this.apiUrl}/loginById`, {email:email}).pipe(
        catchError(error => {
          console.error('Error fetching user:', error);
          return of(null); // Devuelve null en caso de error
        })
      );
    } else {
      console.error('User not logged in');
      return of(null); // Devuelve null si no hay userId en el localStorage
    }
  }
}
