import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaValidacionComprobanteComponent } from './tabla-validacion-comprobante.component';
import { FormularioService } from '../services/formulario.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';


interface Form {
  id: string;
  estadoValidacionFormulario: string;
  estadoValidacionPago: string;
  dni: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

describe('TablaValidacionComprobanteComponent', () => {
  let component: TablaValidacionComprobanteComponent;
  let fixture: ComponentFixture<TablaValidacionComprobanteComponent>;
  let mockFormularioService: jasmine.SpyObj<FormularioService>;

  beforeEach(async () => {
    mockFormularioService = jasmine.createSpyObj('FormularioService', [
      'getFormsAll',
      'approveComp',
      'rejectComp',
      'rejectForm'
    ]);

    await TestBed.configureTestingModule({
      declarations: [TablaValidacionComprobanteComponent],
      imports: [FormsModule],  // Importa FormsModule aquí
      providers: [
        { provide: FormularioService, useValue: mockFormularioService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    // Mock de métodos para devolver un Observable vacío por defecto
    mockFormularioService.getFormsAll.and.returnValue(of([]));
    mockFormularioService.approveComp.and.returnValue(of({}));
    mockFormularioService.rejectComp.and.returnValue(of({}));
    mockFormularioService.rejectForm.and.returnValue(of({}));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaValidacionComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los formularios aprobados pendientes de pago al iniciar', () => {
    const formsMock: Form[] = [
      { id: '1', estadoValidacionFormulario: 'approved', estadoValidacionPago: 'pending', dni: '1234567890', name: 'John', lastName: 'Doe', email: 'john.doe@example.com', phoneNumber: '1234567890', address: 'Address 1' },
      { id: '2', estadoValidacionFormulario: 'approved', estadoValidacionPago: 'completed', dni: '0987654321', name: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phoneNumber: '0987654321', address: 'Address 2' }
    ];

    mockFormularioService.getFormsAll.and.returnValue(of(formsMock));

    component.fetchForms();

    expect(mockFormularioService.getFormsAll).toHaveBeenCalled();
    expect(component['forms'].length).toBe(1);  // Solo uno pendiente de pago
  });

  it('debería manejar errores al cargar los formularios', () => {
    mockFormularioService.getFormsAll.and.returnValue(throwError(() => new Error('Error fetching forms')));

    spyOn(console, 'error');  // Espía para errores de consola

    component.fetchForms();
    expect(console.error).toHaveBeenCalledWith('Error fetching forms:', jasmine.any(Error));
  });

  it('debería aprobar un comprobante correctamente', fakeAsync(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);

    component.approveComp('1');

    // Simula el paso del tiempo para resolver la promesa
    tick();

    expect(mockFormularioService.approveComp).toHaveBeenCalledWith('1');
  }));

  it('debería rechazar un comprobante correctamente', fakeAsync(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);

    component.rejectComp('1');

    // Simula el paso del tiempo para resolver la promesa
    tick();

    expect(mockFormularioService.rejectComp).toHaveBeenCalledWith('1');
  }));

  it('debería calcular correctamente el ancho de la barra de progreso', () => {
    component.petAdoptions = [
      { id: 1, firstName: 'Kevin', lastName: 'Azua', email: 'kevinazua@example.com', phone: '0992972223', address: 'Bomboli, Santo Domingo, SD', status: 'completed', receiptImagePath: 'img/comprobante2.jpg' },
      { id: 2, firstName: 'Josue', lastName: 'Espinoza', email: 'josueespinoza@example.com', phone: '0992992223', address: 'Vergeles, Guayaquil, GYE', status: 'completed', receiptImagePath: 'img/comprobante1.jpg' },
      { id: 3, firstName: 'Fabricio', lastName: 'Alama', email: 'fabalama@example.com', phone: '0992873334', address: 'Calle 15 Av 17, Manta, MEC', status: 'completed', receiptImagePath: 'img/comprobante3.jpg' },
    ];

    const progress = component.progressWidth;
    expect(progress).toBe('100%');  // Todas las adopciones están completadas
  });

  it('debería devolver las iniciales correctas para el usuario', () => {
    const initials = component.getInitials('John', 'Doe');
    expect(initials).toBe('JD');
  });

  it('debería devolver la clase de estado correcta', () => {
    expect(component.getStatusClass('completed')).toBe('bg-green-200');
    expect(component.getStatusClass('pending')).toBe('bg-yellow-200');
    expect(component.getStatusClass('hold')).toBe('bg-red-200');
  });

  it('debería mostrar el modal y establecer la ruta de la imagen del comprobante', () => {
    spyOn(component['cd'], 'detectChanges');
    component.verComprobante('path/to/image.jpg');
    expect(component.receiptImagePath).toBe('https://api.pet-adoption.amauta.education/path/to/image.jpg');
    expect(component.displayModal).toBeTrue();
    expect(component['cd'].detectChanges).toHaveBeenCalled();
  });

  it('debería buscar adopciones correctamente', () => {
    component.originalPetAdoptions = [
      { id: 1, firstName: 'Kevin', lastName: 'Azua', email: 'kevinazua@example.com', phone: '0992972223', address: 'Bomboli, Santo Domingo, SD', status: 'completed', receiptImagePath: 'img/comprobante2.jpg' },
      { id: 2, firstName: 'Josue', lastName: 'Espinoza', email: 'josueespinoza@example.com', phone: '0992992223', address: 'Vergeles, Guayaquil, GYE', status: 'completed', receiptImagePath: 'img/comprobante1.jpg' },
    ];

    component.searchTerm = 'kevin';
    component.search();
    expect(component.petAdoptions.length).toBe(1);
    expect(component.petAdoptions[0].firstName).toBe('Kevin');
  });
});
