import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PetAdoption {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  idDocumento: string;
  cedula: string;
  ocupacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {

  private apiUrl = 'http://localhost:3000/api/forms';

  constructor(private http: HttpClient) { }

  createForm(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createForm`, formData);
  }

  getPetAdoptions(userId: string): Observable<PetAdoption[]> {
    return this.http.get<PetAdoption[]>(`${this.apiUrl}/user/${userId}`);
  }
}
