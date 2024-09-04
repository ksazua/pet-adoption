import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UploadFileComponent } from './upload-file.component';
import { MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { FormularioService } from '../services/formulario.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UploadFileComponent', () => {
  let component: UploadFileComponent;
  let fixture: ComponentFixture<UploadFileComponent>;
  let mockFormularioService: jasmine.SpyObj<FormularioService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    mockFormularioService = jasmine.createSpyObj('FormularioService', ['uploadPayment']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      declarations: [ UploadFileComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: FormularioService, useValue: mockFormularioService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection with allowed type', () => {
    const event = { files: [new File([''], 'example.png', { type: 'image/png' })] };
    component.onSelect({ files: event.files });
    expect(component.file).toEqual(jasmine.any(File));
    expect(mockMessageService.add).not.toHaveBeenCalled();
  });

  it('should reject file selection with disallowed type', () => {
    const event = { files: [new File([''], 'example.txt', { type: 'text/plain' })] };
    component.onSelect({ files: event.files });
    expect(component.file).toBeNull();
    expect(mockMessageService.add).toHaveBeenCalled();
  });

  it('should remove file', () => {
    component.file = new File([''], 'example.png', { type: 'image/png' });
    component.onRemove({});
    expect(component.file).toBeNull();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'info', summary: 'Archivo eliminado', detail: 'El archivo ha sido eliminado.'
    });
  });

  it('should submit file if file is selected', () => {
    component.file = new File([''], 'example.png', { type: 'image/png' });
    mockFormularioService.uploadPayment.and.returnValue(of({ message: 'Success' }));
    component.onSubmit();
    expect(mockFormularioService.uploadPayment).toHaveBeenCalled();
  });
});
