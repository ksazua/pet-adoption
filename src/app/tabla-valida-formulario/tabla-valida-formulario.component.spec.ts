import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { TablaValidaFormularioComponent } from './tabla-valida-formulario.component';
import { FormularioService } from '../services/formulario.service';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Definir el tipo completo de Form
interface Form {
  id: string;
  dni: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  estadoValidacionFormulario: string;
  estadoValidacionPago: string;
}

describe('TablaValidaFormularioComponent', () => {
  let component: TablaValidaFormularioComponent;
  let fixture: ComponentFixture<TablaValidaFormularioComponent>;
  let mockFormularioService: jasmine.SpyObj<FormularioService>;
  let mockAdminService: jasmine.SpyObj<AdminService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockFormularioService = jasmine.createSpyObj('FormularioService', ['getFormsAll', 'approveForm', 'rejectForm']);
    mockAdminService = jasmine.createSpyObj('AdminService', ['getLoggedInUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TablaValidaFormularioComponent],
      imports: [FormsModule], // Asegúrate de importar FormsModule aquí
      providers: [
        { provide: FormularioService, useValue: mockFormularioService },
        { provide: AdminService, useValue: mockAdminService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaValidaFormularioComponent);
    component = fixture.componentInstance;

    // Configurar espías de servicios
    mockFormularioService.getFormsAll.and.returnValue(of([
      { id: '1', dni: '1234567890', name: 'John', lastName: 'Doe', email: 'john.doe@example.com', phoneNumber: '1234567890', address: '123 Main St', estadoValidacionFormulario: 'pending', estadoValidacionPago: 'pending' },
      { id: '2', dni: '0987654321', name: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phoneNumber: '0987654321', address: '456 Elm St', estadoValidacionFormulario: 'approved', estadoValidacionPago: 'approved' }
    ]));
    mockFormularioService.approveForm.and.returnValue(of({}));
    mockFormularioService.rejectForm.and.returnValue(of({}));
    mockAdminService.getLoggedInUser.and.returnValue(of({
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin'
    }));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a fetchForms al iniciar', () => {
    expect(mockFormularioService.getFormsAll).toHaveBeenCalled();
  });

  it('debería cargar los formularios pendientes correctamente', () => {
    component.fetchForms();
    expect(component.forms.length).toBe(1);
    expect(component.forms[0].estadoValidacionFormulario).toBe('pending');
  });

  it('debería manejar errores al cargar los formularios', () => {
    spyOn(console, 'error');
    mockFormularioService.getFormsAll.and.returnValue(throwError('Error'));
    component.fetchForms();
    expect(console.error).toHaveBeenCalledWith('Error fetching forms:', 'Error');
  });

  it('debería aprobar un formulario correctamente', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    await component.approveForm('1');
    expect(mockFormularioService.approveForm).toHaveBeenCalledWith('1');
  });

  it('debería rechazar un formulario correctamente', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    await component.rejectForm('1');
    expect(mockFormularioService.rejectForm).toHaveBeenCalledWith('1');
  });

  it('debería cambiar la página correctamente', () => {
    component.changePage(2);
    expect(component.currentPage).toBe(2);
  });

  it('debería cambiar el tamaño de página correctamente', () => {
    component.changePageSize(10);
    expect(component.pageSize).toBe(10);
  });

  it('debería buscar formularios correctamente', () => {
    component.originalForms = [
      { id: '1', dni: '1234567890', name: 'John', lastName: 'Doe', email: 'john.doe@example.com', phoneNumber: '1234567890', address: '123 Main St', estadoValidacionFormulario: 'pending', estadoValidacionPago: 'pending' },
      { id: '2', dni: '0987654321', name: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phoneNumber: '0987654321', address: '456 Elm St', estadoValidacionFormulario: 'pending', estadoValidacionPago: 'pending' }
    ];
    component.searchTerm = 'John';
    component.search();
    expect(component.forms.length).toBe(1);
    expect(component.forms[0].name).toBe('John');
  });

  it('debería devolver las iniciales correctas para el usuario', () => {
    const initials = component.getInitials('John', 'Doe');
    expect(initials).toBe('JD');
  });

  afterEach(() => {
    mockFormularioService.getFormsAll.calls.reset();
    mockFormularioService.approveForm.calls.reset();
    mockFormularioService.rejectForm.calls.reset();
    mockAdminService.getLoggedInUser.calls.reset();
    mockRouter.navigate.calls.reset();
  });
});
