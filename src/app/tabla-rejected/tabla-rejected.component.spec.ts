import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaRejectedComponent } from './tabla-rejected.component';
import { FormularioService, Form } from '../services/formulario.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TablaRejectedComponent', () => {
  let component: TablaRejectedComponent;
  let fixture: ComponentFixture<TablaRejectedComponent>;
  let mockFormularioService: jasmine.SpyObj<FormularioService>;

  beforeEach(async () => {
    mockFormularioService = jasmine.createSpyObj('FormularioService', ['getFormsAll']);

    await TestBed.configureTestingModule({
      declarations: [TablaRejectedComponent],
      providers: [
        { provide: FormularioService, useValue: mockFormularioService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRejectedComponent);
    component = fixture.componentInstance;

    // Configuración del mock para que devuelva un valor por defecto
    mockFormularioService.getFormsAll.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar la lista de formularios como vacía', () => {
    expect(component.forms.length).toBe(0);
  });

  it('debería cargar los formularios rechazados correctamente', () => {
    const mockForms: Form[] = [
      {
        id: '1',
        dni: '1234567890',
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        address: '123 Main St',
        estadoValidacionFormulario: 'rejected',
        estadoValidacionPago: 'pending'
      },
      {
        id: '2',
        dni: '0987654321',
        name: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phoneNumber: '0987654321',
        address: '456 Elm St',
        estadoValidacionFormulario: 'approved',
        estadoValidacionPago: 'approved'
      }
    ];

    // Configuración del mock para devolver formularios rechazados y aprobados
    mockFormularioService.getFormsAll.and.returnValue(of(mockForms));

    component.fetchRejectedForms();

    expect(component.forms.length).toBe(1);
    expect(component.forms[0].estadoValidacionFormulario).toBe('rejected');
  });

  it('debería manejar errores al cargar los formularios', () => {
    spyOn(console, 'error');

    // Configuración del mock para simular un error
    mockFormularioService.getFormsAll.and.returnValue(throwError(() => new Error('Error fetching forms')));

    component.fetchRejectedForms();

    expect(console.error).toHaveBeenCalledWith('Error fetching rejected forms:', jasmine.any(Error));
  });

  it('debería devolver las iniciales correctas para el usuario', () => {
    const initials = component.getInitials('John', 'Doe');
    expect(initials).toBe('JD');
  });
});
