import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PetAdoptionComponent } from './pet-adoption/pet-adoption.component';
import { TablaValidacionComprobanteComponent } from './tabla-validacion-comprobante/tabla-validacion-comprobante.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from "primeng/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToolbarModule } from "primeng/toolbar";
import { TablaValidaFormularioComponent } from './tabla-valida-formulario/tabla-valida-formulario.component';
import {DialogModule} from "primeng/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { UploadFileComponent } from './upload-file/upload-file.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { TablaUploadFileComponent } from './tabla-upload-file/tabla-upload-file.component';
import { InicioComponent } from './inicio/inicio.component';
 import {MatMenuModule} from '@angular/material/menu';
import {MatIcon} from "@angular/material/icon";
import {MenuModule} from 'primeng/menu';
import { FormAdopcionComponent } from './form-adopcion/form-adopcion.component';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { LoginComponent } from './login/login.component';
import { TablaRejectedComponent } from './tabla-rejected/tabla-rejected.component';



@NgModule({
  declarations: [
    AppComponent,
    PetAdoptionComponent,
    TablaValidacionComprobanteComponent,
    TablaValidaFormularioComponent,
    UploadFileComponent,
    TablaUploadFileComponent,
    InicioComponent,
    FormAdopcionComponent,
    LoginComponent,
    TablaRejectedComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TimelineModule,
    FormsModule,
    ReactiveFormsModule,
    ToolbarModule,
    DialogModule,
    BrowserAnimationsModule,
    FileUploadModule,
    ToastModule,
    HttpClientModule,
    MatMenuModule,
    MatIcon,
    MenuModule,
    ConfirmDialogModule

  ],
  providers: [
    provideClientHydration(),
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
