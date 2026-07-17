import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // 1. Importante para la navegación
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone'; // 2. Agregamos IonButtons
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';

import { addIcons } from 'ionicons';
import { water, trashOutline, addCircleOutline, personCircleOutline } from 'ionicons/icons'; // 3. Agregamos el icono de perfil

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    RouterLink,    // Agregado
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonButtons,    // Agregado
    CommonModule,
    FormsModule
  ],
})
export class Tab1Page implements OnInit {

  estado1: any;
  estado2: any;

  constructor(
    private http: HttpClient,
    private bd: UsuariosService
  ) {
    addIcons({
      water,
      trashOutline,
      addCircleOutline,
      personCircleOutline // Agregado
    });
  }

  ngOnInit() {
    this.bd.getEstadoValvula('67bb6f2e85118d10af317f79').subscribe((res: any) => {
      if (res && res.Respuesta && res.Respuesta.estado !== undefined) {
        this.estado1 = res.Respuesta.estado;
      }
    });

    this.bd.getEstadoValvula('67bb79ac1c82e9d42d445882').subscribe((res: any) => {
      if (res && res.Respuesta && res.Respuesta.estado !== undefined) {
        this.estado2 = res.Respuesta.estado;
      }
    });
  }

  toggleEstado1() {
    this.estado1 = !this.estado1;
    const endpoint = this.estado1
      ? 'https://apiriego.onrender.com/actualizarEstado/67bb6f2e85118d10af317f79'
      : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb6f2e85118d10af317f79';

    this.http.put(endpoint, { headers: { 'Content-Type': 'application/json' } }).subscribe(response => {
      this.mostrarAlerta('Estado actualizado', `El sistema está ${this.estado1 ? 'Activado' : 'Desactivado'}.`);
    });
  }

  toggleEstado2() {
    this.estado2 = !this.estado2;
    const endpoint = this.estado2
      ? 'https://apiriego.onrender.com/actualizarEstado/67bb79ac1c82e9d42d445882'
      : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb79ac1c82e9d42d445882';

    this.http.put(endpoint, { headers: { 'Content-Type': 'application/json' } }).subscribe(response => {
      this.mostrarAlerta('Estado actualizado', `El sistema está ${this.estado2 ? 'Activado' : 'Desactivado'}.`);
    });
  }

  // ... (Tus métodos stateConfiguracion y otros permanecen igual)
  stateConfiguracion() {
     this.http.put('https://apiriego.onrender.com/actualizarEstado/67bb6f2e85118d10af317f79', {}).subscribe();
  }

  agregarSector() {
    this.mostrarAlerta('Próximamente', 'Aquí podrás crear un nuevo sector.');
  }

  eliminarSector(sector: number) {
    this.mostrarAlerta('Próximamente', `Aquí podrás eliminar el Sector ${sector}.`);
  }

  mostrarAlerta(titulo: string, mensaje: string) {
    alert(`${titulo}\n${mensaje}`);
  }
}