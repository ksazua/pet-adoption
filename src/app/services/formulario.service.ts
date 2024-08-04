import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {format} from "date-fns";

export interface Form {
  id: string;
  dni: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  estadoValidacionFormulario: string;
  urlPayment?: string;
  // Add other form fields as needed
}

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  private apiUrl = 'http://localhost:3000/api/forms';

  constructor(private http: HttpClient) {
  }

  getFormsAll(): Observable<Form[]> {
    return this.http.get<Form[]>(`${this.apiUrl}`);
  }

  approveForm(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectForm(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, {});
  }

  uploadPayment(id: string, payload: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/upload-payment`, payload);
  }
}
