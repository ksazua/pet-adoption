import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {FormularioService, Form} from '../services/formulario.service';
import {AdminService, User} from '../services/admin.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tabla-valida-formulario',
  templateUrl: './tabla-valida-formulario.component.html',
  styleUrls: ['./tabla-valida-formulario.component.css']
})
export class TablaValidaFormularioComponent implements OnInit {
  forms: Form[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  originalForms: Form[] = [];
  user: User | null = null;
  userPassword: string = 'admin123';


  constructor(private formularioService: FormularioService, private adminService: AdminService, private router: Router) {
    this.user = {
      name: localStorage.getItem('name')!,
      email: localStorage.getItem('email')!,
      role: localStorage.getItem('role')!,
    };
  }

  ngOnInit(): void {
    this.fetchForms();
    this.fetchUser();
  }

  fetchForms(): void {
    this.formularioService.getFormsAll().subscribe(
      response => {
        this.forms = response.filter(form => form.estadoValidacionFormulario === 'pending');
        this.originalForms = response;
      },
      error => {
        console.error('Error fetching forms:', error);
      }
    );
  }

  fetchUser(): void {
    const userId = 'VRaeh4ufdmbpHF5ieBMU'; // ID correcto del administrador
    this.adminService.getLoggedInUser(userId, this.userPassword).subscribe(
      user => {
        this.user = user;
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
  }

  approveForm(id: string): void {
    Swal.fire({
      title: '¿Estás seguro de que deseas aprobar?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6abfab',
      cancelButtonColor: '#ff1493',
      confirmButtonText: 'Sí, apruébalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formularioService.approveForm(id).subscribe(
          () => {
            Swal.fire('Aprobado!', 'La adopción ha sido aprobada.', 'success');
            this.removeFormFromList(id); // Elimina el formulario aprobado de la lista
          },
          error => {
            console.error('Error approving form:', error);
            Swal.fire('Error', 'Hubo un error al aprobar el formulario.', 'error');
          }
        );
      }
    });
  }

  rejectForm(id: string): void {
    Swal.fire({
      title: '¿Estás seguro de que deseas rechazar?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6abfab',
      cancelButtonColor: '#ff1493',
      confirmButtonText: 'Sí, recházalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formularioService.rejectForm(id).subscribe(
          () => {
            Swal.fire('Rechazado!', 'La adopción ha sido rechazada.', 'success');
            this.removeFormFromList(id); // Elimina el formulario rechazado de la lista
          },
          error => {
            console.error('Error rejecting form:', error);
            Swal.fire('Error', 'Hubo un error al rechazar el formulario.', 'error');
          }
        );
      }
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
  }

  get currentRecords(): Form[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.forms.slice(start, end);
  }

  search(): void {
    this.forms = this.originalForms.filter(form =>
      form.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      form.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      form.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  protected readonly Math = Math;

  private removeFormFromList(id: string): void {
    this.forms = this.forms.filter(form => form.id !== id);
    this.originalForms = this.originalForms.filter(form => form.id !== id);
  }
}
