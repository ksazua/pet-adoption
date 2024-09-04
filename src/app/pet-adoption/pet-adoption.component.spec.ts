import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetAdoptionComponent } from './pet-adoption.component';
import { AdoptionService } from '../services/adoption.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PetAdoptionComponent', () => {
  let component: PetAdoptionComponent;
  let fixture: ComponentFixture<PetAdoptionComponent>;
  let mockAdoptionService: jasmine.SpyObj<AdoptionService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAdoptionService = jasmine.createSpyObj('AdoptionService', ['someMethod']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PetAdoptionComponent],
      providers: [
        { provide: AdoptionService, useValue: mockAdoptionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PetAdoptionComponent);
    component = fixture.componentInstance;

    mockAuthService.getCurrentUser.and.returnValue(of({
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      address: '123 Main St',
      dni: '1717171717',
      postalCode: '12345',
      role: 'client',
      petType: 'perro',
      reason: 'compañía',
      houseType: 'casa',
      financialAbility: 'alta',
      occupation: 'ingeniero',
      previousPets: 'no',
      estadoValidacionFormulario: 'approved',
      estadoValidacionPago: 'pending'
    }));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las adopciones de usuario al iniciar', () => {
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
  });

  it('debería devolver las iniciales correctas para el usuario', () => {
    const initials = component.getInitials('John', 'Doe');
    expect(initials).toBe('JD');
  });

  it('debería capitalizar la primera letra de una cadena', () => {
    const result = component.capitalizeFirstLetter('hello');
    expect(result).toBe('Hello');
  });

  it('debería devolver la clase correcta para el estado del paso', () => {
    const step: any = { label: 'Pago', icon: 'pi pi-check', date: '', status: 'completed' };
    expect(component.getStepClass(step)).toBe('bg-green-500 text-white');
  });

  it('debería devolver la imagen correcta de la mascota en función del tipo de mascota', () => {
    const imageUrl = component.getPetImage('perro');
    expect(imageUrl).toBe('https://res.cloudinary.com/ddodvvqcq/image/upload/v1722727971/img/DogAvatar.jpg');
  });

  it('debería mostrar un mensaje de Swal si el pago no está habilitado', () => {
    spyOn(Swal, 'fire');
    component.user = { estadoValidacionFormulario: 'approved', estadoValidacionPago: 'rejected' };
    component.handlePaymentClick();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'info',
      title: 'Información',
      text: 'Su pago ha sido rechazado. Por favor, contacte al soporte.',
      confirmButtonText: 'Aceptar'
    }));
  });

  it('debería navegar a upload-file si el pago está habilitado', () => {
    component.user = { estadoValidacionFormulario: 'approved', estadoValidacionPago: 'pending' };
    component.form = { id: 1 };
    component.handlePaymentClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/upload-file', 1]);
  });

  it('debería configurar los pasos en función del estado del usuario', () => {
    component.loadUserAdoptions();
    fixture.detectChanges();
    expect(component.steps.length).toBeGreaterThan(0);
  });
});
