import {Component, OnInit} from '@angular/core';
import {AdoptionService} from '../services/adoption.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

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

interface Step {
  label: string;
  icon: string;
  date: string;
  status: 'completed' | 'current' | 'hold' | 'upcoming' | 'rejected';
}

@Component({
  selector: 'app-pet-adoption',
  templateUrl: './pet-adoption.component.html',
  styleUrls: ['./pet-adoption.component.css'],
})
export class PetAdoptionComponent implements OnInit {
  petAdoptions: PetAdoption[] = [];
  user: any;
  form!: any;

  steps: Step[] = [
    {label: 'Solicitud', icon: 'pi pi-file', date: '', status: 'completed'},
  ];

  constructor(
    private adoptionService: AdoptionService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadUserAdoptions();
  }

  loadUserAdoptions(): void {
    const email = localStorage.getItem('email');

    if (email) {
      this.authService.getCurrentUser(email).subscribe(
        (response) => {
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

          if (response.estadoValidacionFormulario == 'pending') {
            this.steps.push(
              {label: 'Pendiente', icon: 'pi pi-pause', date: 'Formulario', status: 'hold'},
            )
          }
          if (response.estadoValidacionFormulario == 'approved') {
            this.steps.push(
              {label: 'Aprobado', icon: 'pi pi-check', date: 'Formulario', status: 'completed'},
            )
          }
          if (response.estadoValidacionFormulario == 'rejected') {
            this.steps.push(
              {label: 'Rechazado', icon: 'pi pi-ban', date: 'Formulario ', status: 'rejected'},
            )
          }

          if (response.estadoValidacionFormulario == 'approved') {
            if (response.estadoValidacionPago == 'pending') {
              this.steps.push(
                {label: 'Pendiente', icon: 'pi pi-pause', date: 'Pago', status: 'hold'},
              )
            }
            if (response.estadoValidacionPago == 'approved') {
              this.steps.push(
                {label: 'Aprobado', icon: 'pi pi-check', date: 'Pago', status: 'completed'},
              )
            }
            if (response.estadoValidacionPago == 'rejected') {
              this.steps.push(
                {label: 'Rechazado', icon: 'pi pi-ban', date: 'Pago', status: 'rejected'},
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

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

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
      case 'rejected':
        return 'bg-red-200 text-red-700';
      default:
        return '';
    }
  }

  getSeparatorClass(index: number): string {
    if (index < this.steps.length - 1) {
      const currentStep = this.steps[index];
      const nextStep = this.steps[index + 1];

      if (currentStep.status === 'completed' && nextStep.status === 'completed') {
        return 'bg-green-500';
      } else if (currentStep.status === 'completed' && nextStep.status === 'hold') {
        return 'bg-yellow-400';
      } else if (currentStep.status === 'completed' && nextStep.status === 'rejected') {
        return 'bg-red-500';
      } else {
        return 'bg-gray-300';
      }
    }
    return '';
  }

  isPaymentEnabled(): boolean {
    return this.form?.estadoValidacionFormulario === 'approved';
  }

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

  getPetImage(petType: string): string {
    if (petType.toLowerCase() === 'gato') {
      return 'https://res.cloudinary.com/ddodvvqcq/image/upload/v1722742575/img/CatAvatar.jpg';
    } else if (petType.toLowerCase() === 'perro') {
      return 'https://res.cloudinary.com/ddodvvqcq/image/upload/v1722727971/img/DogAvatar.jpg';
    } else {
      return 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    }
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  getStatusBoxClass(): string {
    if (this.user?.estadoValidacionFormulario === 'rejected') {
      return 'bg-red-100 text-red-500 w-8 h-8 flex items-center justify-center rounded-md';
    } else if (this.user?.estadoValidacionFormulario === 'approved') {
      return 'bg-blue-100 text-blue-500 w-8 h-8 flex items-center justify-center rounded-md';
    } else {
      return 'bg-yellow-100 text-yellow-400 w-8 h-8 flex items-center justify-center rounded-md';
    }
  }

  getStatusIcon(): string {
    if (this.user?.estadoValidacionFormulario === 'rejected') {
      return 'pi pi-times';
    } else if (this.user?.estadoValidacionFormulario === 'approved') {
      return 'pi pi-clock';
    } else {
      return 'pi pi-envelope';
    }
  }

  getStatusText(): string {
    if (this.user?.estadoValidacionFormulario === 'rejected') {
      return 'Solicitud rechazada';
    } else if (this.user?.estadoValidacionFormulario === 'approved') {
      return 'En espera de su comprobante';
    } else {
      return 'Revisión iniciada';
    }
  }
}
