import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormularioService } from '../services/formulario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  @Input() id!: string;
  form: FormGroup;
  file: File | null = null;
  isSubmitted = false;
  protected readonly formularioService = inject(FormularioService);

  constructor(private messageService: MessageService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  get nameField() {
    return this.form.get('name');
  }

  onSelect(event: any) {
    const file = event.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

    if (this.file) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ya se ha seleccionado un archivo. Elimine el archivo actual para seleccionar uno nuevo.'
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Solo se permiten archivos de imagen (jpg, png, gif, bmp, webp).'
      });
      return;
    }

    this.file = file;
    this.isSubmitted = false;
  }

  onRemove(event: any) {
    this.file = null;
    this.isSubmitted = false;
    this.messageService.add({ severity: 'info', summary: 'Archivo eliminado', detail: `El archivo ha sido eliminado.` });
  }

  onSubmit() {
    if (this.file) {
      const payload = new FormData();
      payload.append('file', this.file);

      this.formularioService.uploadPayment(this.id, payload).subscribe(
        response => {
          Swal.fire({
            title: 'Subido con éxito!',
            text: 'El archivo se ha subido correctamente.',
            icon: 'success',
            confirmButtonColor: '#6abfab',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/pet-adoption']);
          });
        },
        error => {
          console.error('Error uploading file:', error);
          Swal.fire('Error', 'Hubo un error al subir el archivo.', 'error');
        }
      );
    }
  }
}
