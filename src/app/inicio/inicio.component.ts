import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  items: MenuItem[] | undefined

  constructor(private router: Router) {
  }

ngOnInit() {
  this.items = [
    {
      label: 'Iniciar',
      items: [
        {
          label: 'Usuario',
          icon: 'pi pi-fw pi-user',
          command: () => {
            this.router.navigate(['/pet-adoption']);
          }
        },
        {
          label: 'Administrador',
          icon: 'pi pi-fw pi-cog',
          command: () => {
            this.router.navigate(['/tabla-valida-formulario']);
          }
        }
      ]
    }
  ];
}

}
