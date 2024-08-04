import {Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import {AuthService} from '../services/auth.service'; // Asegúrate de ajustar la ruta si es necesario

@Component({
  selector: 'app-tabla-upload-file',
  templateUrl: './tabla-upload-file.component.html',
  styleUrls: ['./tabla-upload-file.component.css']
})
export class TablaUploadFileComponent implements OnInit {
  @Input() id!: string;
  receiptImagePath: string = '';
  displayModal: boolean = false;
  user: any;

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const email = localStorage.getItem('email');

    if (email) {
      this.authService.getCurrentUser(email).subscribe(
        (response) => {
          this.user = {
            firstName: response.name,
            lastName: response.lastName,
            email: response.email,
            phone: response.phoneNumber,
            address: response.address,
            idDocumento: response.dni,
            postalCode: response.postalCode,
            role: response.role || 'Cliente',
            photoUrl: response.photoUrl // Asumiendo que el URL de la foto está en la respuesta
          };
          this.cd.detectChanges();
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }

  verComprobante(receiptPath: string) {
    this.receiptImagePath = receiptPath;
    this.displayModal = true;
    this.cd.detectChanges();
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }
}
