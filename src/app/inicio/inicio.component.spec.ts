import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InicioComponent } from './inicio.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [InicioComponent],
      schemas: [NO_ERRORS_SCHEMA] // Para ignorar errores de elementos de PrimeNG
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar los elementos del menú en ngOnInit', () => {
    expect(component.items).toBeDefined();
    expect(component.items!.length).toBe(1);
    expect(component.items![0].label).toBe('Iniciar');
    expect(component.items![0].items!.length).toBe(2);
    expect(component.items![0].items![0].label).toBe('Usuario');
    expect(component.items![0].items![1].label).toBe('Administrador');
  });

  it('debería navegar a /pet-adoption cuando se selecciona "Usuario"', () => {
    spyOn(router, 'navigate');

    // Ejecuta el comando asociado al elemento "Usuario"
    const usuarioCommand = component.items![0].items![0].command;
    if (usuarioCommand) {
      usuarioCommand({} as any); // Proporciona un objeto de evento vacío
    }

    expect(router.navigate).toHaveBeenCalledWith(['/pet-adoption']);
  });

  it('debería navegar a /tabla-valida-formulario cuando se selecciona "Administrador"', () => {
    spyOn(router, 'navigate');

    // Ejecuta el comando asociado al elemento "Administrador"
    const adminCommand = component.items![0].items![1].command;
    if (adminCommand) {
      adminCommand({} as any); // Proporciona un objeto de evento vacío
    }

    expect(router.navigate).toHaveBeenCalledWith(['/tabla-valida-formulario']);
  });
});
