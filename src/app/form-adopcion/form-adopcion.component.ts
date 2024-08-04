import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AdoptionService } from '../services/adoption.service';
import Swal from 'sweetalert2';

export function onlyLettersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const onlyLetters = /^[a-zA-Z\s]+$/.test(value);
    return onlyLetters ? null : { 'onlyLetters': { value } };
  };
}

export function onlyNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const onlyNumbers = /^[0-9]+$/.test(value);
    return onlyNumbers ? null : { 'onlyNumbers': { value } };
  };
}

export function noRepeatedDigitsValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const isRepeated = /^(\d)\1+$/.test(value);
    return isRepeated ? { 'noRepeatedDigits': { value } } : null;
  };
}

export function adultAgeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age >= 18 ? null : { 'adultAge': { value } };
  };
}

@Component({
  selector: 'app-form-adopcion',
  templateUrl: './form-adopcion.component.html',
  styleUrls: ['./form-adopcion.component.scss']
})
export class FormAdopcionComponent {
  adoptionForm!: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private adoptionService: AdoptionService) {
    this.buildForm();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private buildForm(): void {
    this.adoptionForm = this.fb.group({
      name: new FormControl ('', [Validators.required, Validators.maxLength(50), onlyLettersValidator()]),
      lastName: new FormControl ('', [Validators.required, onlyLettersValidator()]),
      dni: new FormControl('',[Validators.required,Validators.maxLength(10),Validators.minLength(10), onlyNumbersValidator(), noRepeatedDigitsValidator()]),
      birthYear: ['', [Validators.required, adultAgeValidator()]],
      address: ['', Validators.required],
      address2: [''],
      postalCode: ['', onlyNumbersValidator()],
      civilStatus: ['', Validators.required],
      phoneNumber: new FormControl('',[Validators.required,Validators.maxLength(10),Validators.minLength(10), onlyNumbersValidator(), noRepeatedDigitsValidator()]),
      phoneNumber2: [''],
      email: ['', [Validators.required, Validators.email]],
      password: new FormControl('', [Validators.required]),
      familyMembers: ['', Validators.required],
      children: ['', Validators.required],
      numberOfChildren: [{ value: '', disabled: true }],
      futureChildren: [{ value: '', disabled: true }],
      occupation: new FormControl ('', [Validators.required, onlyLettersValidator()]),
      workHours: ['', Validators.required],
      vacations: new FormControl ('', [Validators.required, onlyLettersValidator()]),
      houseType: ['', Validators.required],
      houseOwner: ['', Validators.required],
      housePermission: [{ value: '', disabled: true }],
      yard: ['', Validators.required],
      fence: [{ value: '', disabled: true }],
      petType: ['', Validators.required],
      reason: ['', Validators.required],
      previousPets: ['', Validators.required],
      previousPetsDetails: [{ value: '', disabled: true }],
      currentPets: ['', Validators.required],
      currentPetDetails: [{ value: '', disabled: true }],
      petsNeutered: [{ value: '', disabled: true }],
      petsVaccinated: [{ value: '', disabled: true }],
      financialAbility: new FormControl ('', [Validators.required, onlyLettersValidator()]),
      additionalInfo: ['', Validators.required]
    });

    this.adoptionForm.get('children')?.valueChanges.subscribe(value => {
      this.updateValidators(value);
    });

    this.adoptionForm.get('houseOwner')?.valueChanges.subscribe(value => {
      this.updateHouseOwnerValidators(value);
    });

    this.adoptionForm.get('yard')?.valueChanges.subscribe(value => {
      this.updateyardValidators(value);
    });

    this.adoptionForm.get('previousPets')?.valueChanges.subscribe(value => {
      this.updatepreviousPetsValidators(value);
    });

    this.adoptionForm.get('currentPets')?.valueChanges.subscribe(value => {
      this.updateCurrentPetsValidators(value);
    });
  }

  private updateValidators(children: string): void {
    const numberOfChildrenControl = this.adoptionForm.get('numberOfChildren');
    const futureChildrenControl = this.adoptionForm.get('futureChildren');

    if (numberOfChildrenControl && futureChildrenControl) {
      if (children === 'Sí') {
        numberOfChildrenControl.setValidators([Validators.required]);
        futureChildrenControl.clearValidators();
        futureChildrenControl.setValue('');
        futureChildrenControl.disable();
        numberOfChildrenControl.enable();
      } else {
        futureChildrenControl.setValidators([Validators.required]);
        numberOfChildrenControl.clearValidators();
        numberOfChildrenControl.setValue('');
        numberOfChildrenControl.disable();
        futureChildrenControl.enable();
      }

      numberOfChildrenControl.updateValueAndValidity();
      futureChildrenControl.updateValueAndValidity();
    }
  }

  private updateHouseOwnerValidators(houseOwner: string): void {
    const housePermissionControl = this.adoptionForm.get('housePermission');

    if (housePermissionControl) {
      if (houseOwner === 'No') {
        housePermissionControl.setValidators([Validators.required]);
        housePermissionControl.enable();
      } else {
        housePermissionControl.clearValidators();
        housePermissionControl.setValue('');
        housePermissionControl.disable();
      }

      housePermissionControl.updateValueAndValidity();
    }
  }

  private updateyardValidators(yard: string): void {
    const yardControl = this.adoptionForm.get('fence');

    if (yardControl) {
      if (yard === 'Sí') {
        yardControl.setValidators([Validators.required]);
        yardControl.enable();
      } else {
        yardControl.clearValidators();
        yardControl.setValue('');
        yardControl.disable();
      }

      yardControl.updateValueAndValidity();
    }
  }

  private updatepreviousPetsValidators(previousPets: string): void {
    const previousPetsControl = this.adoptionForm.get('previousPetsDetails');

    if (previousPetsControl) {
      if (previousPets === 'Sí') {
        previousPetsControl.setValidators([Validators.required]);
        previousPetsControl.enable();
      } else {
        previousPetsControl.clearValidators();
        previousPetsControl.setValue('');
        previousPetsControl.disable();
      }

      previousPetsControl.updateValueAndValidity();
    }
  }

  private updateCurrentPetsValidators(currentPets: string): void {
    const count = parseInt(currentPets, 10);
    const currentPetDetailsControl = this.adoptionForm.get('currentPetDetails');
    const petsNeuteredControl = this.adoptionForm.get('petsNeutered');
    const petsVaccinatedControl = this.adoptionForm.get('petsVaccinated');

    if (currentPetDetailsControl && petsNeuteredControl && petsVaccinatedControl) {
      if (count > 0) {
        currentPetDetailsControl.setValidators([Validators.required]);
        petsNeuteredControl.setValidators([Validators.required]);
        petsVaccinatedControl.setValidators([Validators.required]);

        currentPetDetailsControl.enable();
        petsNeuteredControl.enable();
        petsVaccinatedControl.enable();
      } else {
        currentPetDetailsControl.clearValidators();
        petsNeuteredControl.clearValidators();
        petsVaccinatedControl.clearValidators();

        currentPetDetailsControl.setValue('');
        petsNeuteredControl.setValue('');
        petsVaccinatedControl.setValue('');

        currentPetDetailsControl.disable();
        petsNeuteredControl.disable();
        petsVaccinatedControl.disable();
      }

      currentPetDetailsControl.updateValueAndValidity();
      petsNeuteredControl.updateValueAndValidity();
      petsVaccinatedControl.updateValueAndValidity();
    }
  }

  onDniKeyDown(event: KeyboardEvent) {
    const allowedKeys = [8, 9, 46];
    const keyCode = event.keyCode;

    if (!allowedKeys.includes(keyCode)) {
      const allowedChars = /[0-9]/;
      const key = event.key;

      if (!allowedChars.test(key)) {
        event.preventDefault();
      }
    }
  }


  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.adoptionForm.valid) {
      Swal.fire({
        title: "¿Está seguro?",
        text: "Usted acepta que la información proporcionada es veraz y que la Asociación Una Sola Misión se reserva el derecho de aceptar o rechazar su solicitud de adopción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Enviar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.adoptionService.createForm(this.adoptionForm.value).subscribe(
            response => {
              Swal.fire({
                title: "Éxito!",
                text: "Su formulario se ha enviado con éxito. Por favor revise su correo electrónico para más información.",
                icon: "success"
              }).then(() => {
                this.router.navigate(['/login']); // Redirigir al componente de login
              });
              this.adoptionForm.reset();
            },
            error => {
              Swal.fire({
                title: "Error",
                text: "Hubo un error al enviar su formulario. Por favor intente nuevamente.",
                icon: "error"
              });
            }
          );
        }
      });
    } else {
      console.log('Formulario inválido');
      this.adoptionForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.adoptionForm.reset();
    this.router.navigate(['/']);
  }

  get nameField() {
    return this.adoptionForm.get('name');
  }

  get lastNameField() {
    return this.adoptionForm.get('lastName');
  }

  get dniField() {
    return this.adoptionForm.get('dni');
  }

  get birthYearField() {
    return this.adoptionForm.get('birthYear');
  }

  get addressField() {
    return this.adoptionForm.get('address');
  }

  get civilStatusField() {
    return this.adoptionForm.get('civilStatus');
  }

  get phoneNumberField() {
    return this.adoptionForm.get('phoneNumber');
  }

  get emailField() {
    return this.adoptionForm.get('email');
  }

  get familyMembersField() {
    return this.adoptionForm.get('familyMembers');
  }

  get childrenField() {
    return this.adoptionForm.get('children');
  }

  get futureChildrenField() {
    return this.adoptionForm.get('futureChildren');
  }

  get occupationField() {
    return this.adoptionForm.get('occupation');
  }

  get workHoursField() {
    return this.adoptionForm.get('workHours');
  }

  get vacationsField() {
    return this.adoptionForm.get('vacations');
  }

  get houseTypeField() {
    return this.adoptionForm.get('houseType');
  }

  get houseOwnerField() {
    return this.adoptionForm.get('houseOwner');
  }

  get yardField() {
    return this.adoptionForm.get('yard');
  }

  get petTypeField() {
    return this.adoptionForm.get('petType');
  }

  get reasonField() {
    return this.adoptionForm.get('reason');
  }

  get previousPetsField() {
    return this.adoptionForm.get('previousPets');
  }

  get currentPetsField() {
    return this.adoptionForm.get('currentPets');
  }

  get financialAbilityField() {
    return this.adoptionForm.get('financialAbility');
  }

  get postalCodeField() {
    return this.adoptionForm.get('postalCode');
  }

  get address2Field() {
    return this.adoptionForm.get('address2');
  }

  get phoneNumber2Field() {
    return this.adoptionForm.get('phoneNumber2');
  }

  get numberOfChildrenField() {
    return this.adoptionForm.get('numberOfChildren');
  }

  get housePermissionField() {
    return this.adoptionForm.get('housePermission');
  }

  get fenceField() {
    return this.adoptionForm.get('fence');
  }

  get previousPetsDetailsField() {
    return this.adoptionForm.get('previousPetsDetails');
  }

  get currentPetDetailsField() {
    return this.adoptionForm.get('currentPetDetails');
  }

  get petsNeuteredField() {
    return this.adoptionForm.get('petsNeutered');
  }

  get petsVaccinatedField() {
    return this.adoptionForm.get('petsVaccinated');
  }

  get petsPermissionField() {
    return this.adoptionForm.get('petsPermission');
  }

  get petsPermissionDetailsField() {
    return this.adoptionForm.get('petsPermissionDetails');
  }
}
