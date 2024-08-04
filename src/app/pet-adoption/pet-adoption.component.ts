import {Component, OnInit} from '@angular/core';
import {AdoptionService} from '../services/adoption.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2'; // Importa Swal

// Definición de la interfaz PetAdoption para tipar los datos de adopción de mascotas
interface PetAdoption {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  postalCode: string;
  cedula: string;
  ocupacion: string;
}

// Definición de la interfaz Step para tipar los pasos del proceso de adopción
interface Step {
  label: string;
  icon: string;
  date: string;
  status: 'completed' | 'current' | 'hold' | 'upcoming';
}

// Decorador del componente Angular
@Component({
  selector: 'app-pet-adoption',
  templateUrl: './pet-adoption.component.html',
  styleUrls: ['./pet-adoption.component.css'],
})
export class PetAdoptionComponent implements OnInit {
  // Propiedades del componente
  petAdoptions: PetAdoption[] = []; // Lista de adopciones de mascotas
  user: any; // Información del usuario actual
  form!: any; // Formulario de adopción

  // Pasos del proceso de adopción
  steps: Step[] = [
    {label: 'Solicitud', icon: 'pi pi-file', date: 'Jul 12', status: 'completed'},
  ];

  // Constructor del componente con inyección de dependencias
  constructor(
    private adoptionService: AdoptionService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loadUserAdoptions();
  }

  // Carga las adopciones del usuario actual
  loadUserAdoptions(): void {
    const email = localStorage.getItem('email');

    if (email) {
      this.authService.getCurrentUser(email).subscribe(
        (response) => {
          // Asigna la respuesta del servicio a las propiedades del componente
          this.form = response;
          this.user = {
            firstName: response.name,
            lastName: response.lastName,
            email: response.email,
            phone: response.phoneNumber,
            address: response.address,
            idDocumento: response.dni,
            postalCode: response.postalCode,
            role: response.role || 'Cliente',
            petType: response.petType,
            reason: response.reason,
            houseType: response.houseType,
            financialAbility: response.financialAbility,
            occupation: response.occupation,
            previousPets: response.previousPets,
            estadoValidacionFormulario: response.estadoValidacionFormulario
          };

          // Actualiza los pasos del proceso según el estado de validación del formulario
          if (response.estadoValidacionFormulario == 'pending') {
            this.steps.push(
              {label: 'Pendiente', icon: 'pi pi-check', date: 'Jul 12', status: 'hold'},
            )
          }
          if (response.estadoValidacionFormulario == 'approved') {
            this.steps.push(
              {label: 'Aprobado', icon: 'pi pi-check', date: 'Jul 12', status: 'completed'},
            )
          }
          if (response.estadoValidacionFormulario == 'rejected') {
            this.steps.push(
              {label: 'Rechazado', icon: 'pi pi-ban', date: 'Jul 12', status: 'upcoming'},
            )
          }

          // Actualiza los pasos del proceso según el estado de validación del pago
          if (response.estadoValidacionFormulario == 'approved') {
            if (response.estadoValidacionPago == 'pending') {
              this.steps.push(
                {label: 'Pendiente', icon: 'pi pi-check', date: 'Jul 12', status: 'hold'},
              )
            }
            if (response.estadoValidacionPago == 'approved') {
              this.steps.push(
                {label: 'Aprobado', icon: 'pi pi-check', date: 'Jul 12', status: 'completed'},
              )
            }
            if (response.estadoValidacionPago == 'rejected') {
              this.steps.push(
                {label: 'Rechazado', icon: 'pi pi-ban', date: 'Jul 12', status: 'completed'},
              )
            }
          }
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }

  // Obtiene las iniciales del nombre y apellido del usuario
  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  // Obtiene la clase CSS para un paso del proceso según su estado
  getStepClass(step: Step): string {
    switch (step.status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-yellow-400 text-white';
      case 'hold':
        return 'bg-yellow-400 text-white hold';
      case 'upcoming':
        return 'bg-gray-400 text-white';
      default:
        return '';
    }
  }

  // Obtiene la clase CSS para el separador entre pasos del proceso
  getSeparatorClass(index: number): string {
    if (index < this.steps.length - 1) {
      if (this.steps[index].status === 'completed' && this.steps[index + 1].status === 'completed') {
        return 'bg-green-500';
      } else if (this.steps[index].status === 'completed' && this.steps[index + 1].status === 'hold') {
        return 'bg-yellow-400';
      } else {
        return 'bg-gray-300';
      }
    }
    return '';
  }

  // Verifica si el pago está habilitado
  isPaymentEnabled(): boolean {
    return this.form?.estadoValidacionFormulario === 'approved';
  }

  // Maneja el clic en el botón de pago
  handlePaymentClick(): void {
    if (!this.isPaymentEnabled()) {
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Su pago no está disponible en este momento.',
        confirmButtonText: 'Aceptar'
      });
    } else {
      this.router.navigate(['/upload-file', this.form.id]);
    }
  }

  // Navega a la página de carga de archivos si el pago está habilitado
  handlePaymentNavigation(): void {
    if (this.isPaymentEnabled()) {
      this.router.navigate(['/upload-file', this.form.id]);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'En Revisión',
        text: 'Su pago no está disponible, su solicitud está en revisión.',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  // Obtiene la imagen de la mascota según su tipo
  getPetImage(petType: string): string {
    if (petType.toLowerCase() === 'gato') {
      return 'https://res.cloudinary.com/ddodvvqcq/image/upload/v1722742575/img/CatAvatar.jpg';
    } else if (petType.toLowerCase() === 'perro') {
      return 'https://res.cloudinary.com/ddodvvqcq/image/upload/v1722727971/img/DogAvatar.jpg';
    } else {
      return 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    }
  }

  // Formatea el valor de previousPets a 'Sí' o 'No'
  formatPreviousPets(previousPets: boolean): string {
    return previousPets ? 'Sí' : 'No';
  }

  // Capitaliza la primera letra de un valor
  capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
