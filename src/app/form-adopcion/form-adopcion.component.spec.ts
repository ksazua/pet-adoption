import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdopcionComponent } from './form-adopcion.component';

describe('FormAdopcionComponent', () => {
  let component: FormAdopcionComponent;
  let fixture: ComponentFixture<FormAdopcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormAdopcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAdopcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
