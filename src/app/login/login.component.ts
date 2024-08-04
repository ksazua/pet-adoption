import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          if (response) {
            localStorage.setItem('email', response.email);
            localStorage.setItem('role', response.role);
            localStorage.setItem('name', response.name);
            localStorage.setItem('userId', response.id);
          }else{
            Swal.fire({
              title: 'Error',
              text: 'Credenciales incorrectas. Por favor, intente de nuevo.',
              icon: 'error'
            });
          }
          if (response.role === 'admin') {
            this.router.navigate(['/tabla-valida-formulario']); // Redirige al dashboard de admin
          } else if (response.role === 'client') {
            this.router.navigate(['/pet-adoption']); // Redirige al dashboard de cliente
          }
        },
        error => {
          Swal.fire({
            title: 'Error',
            text: 'Credenciales incorrectas. Por favor, intente de nuevo.',
            icon: 'error'
          });
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get emailField() {
    return this.loginForm.get('email');
  }

  get passwordField() {
    return this.loginForm.get('password');
  }
}
