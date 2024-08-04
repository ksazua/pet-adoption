import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetAdoptionComponent } from "./pet-adoption/pet-adoption.component";
import { TablaValidacionComprobanteComponent } from './tabla-validacion-comprobante/tabla-validacion-comprobante.component';
import {TablaValidaFormularioComponent} from "./tabla-valida-formulario/tabla-valida-formulario.component";
import {UploadFileComponent} from "./upload-file/upload-file.component";

import { TablaUploadFileComponent } from './tabla-upload-file/tabla-upload-file.component';

import {InicioComponent} from "./inicio/inicio.component";
import { FormAdopcionComponent } from './form-adopcion/form-adopcion.component';
import { LoginComponent } from './login/login.component';
import {TablaRejectedComponent} from "./tabla-rejected/tabla-rejected.component";


const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'form-adopcion', component: FormAdopcionComponent },
  { path: 'pet-adoption', component: PetAdoptionComponent },
  { path: 'tabla-validacion-comprobante', component: TablaValidacionComprobanteComponent },
  { path: 'tabla-valida-formulario', component: TablaValidaFormularioComponent},
  { path: 'upload-file/:id', component: TablaUploadFileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tabla-rejected', component: TablaRejectedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{bindToComponentInputs: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
