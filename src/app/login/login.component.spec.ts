import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario de login con dos controles', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('debería requerir un email válido', () => {
    const control = component.emailField;
    control!.setValue('');
    expect(control!.valid).toBeFalse();

    control!.setValue('no-valid-email');
    expect(control!.valid).toBeFalse();

    control!.setValue('test@example.com');
    expect(control!.valid).toBeTrue();
  });

  it('debería requerir una contraseña', () => {
    const control = component.passwordField;
    control!.setValue('');
    expect(control!.valid).toBeFalse();

    control!.setValue('password123');
    expect(control!.valid).toBeTrue();
  });

  it('debería no llamar al servicio de login si el formulario es inválido', () => {
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('debería llamar al servicio de login si el formulario es válido', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });

    const mockResponse = { email: 'test@example.com', role: 'admin', name: 'John Doe', id: '12345' };
    mockAuthService.login.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith(component.loginForm.value);
  });

  it('debería mostrar un mensaje de error si el login falla', () => {
    spyOn(Swal, 'fire');
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    mockAuthService.login.and.returnValue(throwError({ status: 401 }));

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Error',
      text: 'Credenciales incorrectas. Por favor, intente de nuevo.',
      icon: 'error'
    }));
  });

  it('debería redirigir a /tabla-valida-formulario si el usuario es admin', () => {
    component.loginForm.setValue({ email: 'admin@example.com', password: 'password123' });

    const mockResponse = { email: 'admin@example.com', role: 'admin', name: 'Admin User', id: '12345' };
    mockAuthService.login.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabla-valida-formulario']);
  });

  it('debería redirigir a /pet-adoption si el usuario es client', () => {
    component.loginForm.setValue({ email: 'client@example.com', password: 'password123' });

    const mockResponse = { email: 'client@example.com', role: 'client', name: 'Client User', id: '67890' };
    mockAuthService.login.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pet-adoption']);
  });
});
