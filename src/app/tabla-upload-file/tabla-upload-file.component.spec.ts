import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaUploadFileComponent } from './tabla-upload-file.component';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TablaUploadFileComponent', () => {
  let component: TablaUploadFileComponent;
  let fixture: ComponentFixture<TablaUploadFileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [TablaUploadFileComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaUploadFileComponent);
    component = fixture.componentInstance;

    // Configura el espía para devolver un objeto de usuario simulado
    mockAuthService.getCurrentUser.and.returnValue(of({
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      address: '123 Main St',
      dni: '1717171717',
      postalCode: '12345',
      role: 'Cliente',
      photoUrl: 'https://example.com/photo.jpg'
    }));

    fixture.detectChanges();
  });

  afterEach(() => {
    mockAuthService.getCurrentUser.calls.reset();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a loadUserInfo al iniciar', () => {
    spyOn(component, 'loadUserInfo');
    component.ngOnInit();
    expect(component.loadUserInfo).toHaveBeenCalled();
  });

  it('debería cargar la información del usuario correctamente', () => {
    component.loadUserInfo();

    expect(component.user).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      idDocumento: '1717171717',
      postalCode: '12345',
      role: 'Cliente',
      photoUrl: 'https://example.com/photo.jpg',
    });
  });

  it('debería manejar errores al cargar la información del usuario', () => {
    spyOn(console, 'error');
    mockAuthService.getCurrentUser.and.returnValue(throwError(() => new Error('Error fetching user')));

    component.loadUserInfo();

    expect(console.error).toHaveBeenCalledWith('Error fetching user:', jasmine.any(Error));
  });

  it('debería establecer la ruta de la imagen del comprobante y mostrar el modal', () => {
    const receiptPath = 'https://example.com/receipt.jpg';

    component.verComprobante(receiptPath);

    expect(component.receiptImagePath).toBe(receiptPath);
    expect(component.displayModal).toBeTrue();
  });

  it('debería devolver las iniciales correctas para el usuario', () => {
    const initials = component.getInitials('John', 'Doe');
    expect(initials).toBe('JD');
  });
});
