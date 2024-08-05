import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'https://api.pet-adoption.amauta.education/api';
 // private apiUrl = 'http://localhost:3003/api';
  constructor(private http: HttpClient) { }

  getLoggedInUser(id: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/loginById`, { id, password });
  }
}
