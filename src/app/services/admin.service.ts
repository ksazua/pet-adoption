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

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getLoggedInUser(id: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/loginById`, { id, password });
  }
}
