import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';

import { addIcons } from 'ionicons';
import { water } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {

  estado1: any;
  estado2: any;

  constructor(private http: HttpClient, private bd: UsuariosService) {
    addIcons({ water });
  }

  ngOnInit() {
    this.bd.getEstadoValvula('67bb6f2e85118d10af317f79').subscribe((res: any) => {
      console.log('Respuesta completa estado1:', res); 
      if (res && res.Respuesta && res.Respuesta.estado !== undefined) {
        this.estado1 = res.Respuesta.estado;
        console.log('Estado1 asignado:', this.estado1);
      } else {
        console.warn('La respuesta no contiene la propiedad "estado".');
      }
    });
  
    this.bd.getEstadoValvula('67bb79ac1c82e9d42d445882').subscribe((res: any) => {
      console.log('Respuesta completa estado2:', res);
      if (res && res.Respuesta && res.Respuesta.estado !== undefined) {
        this.estado2 = res.Respuesta.estado;
        console.log('Estado2 asignado:', this.estado2);
      } else {
        console.warn('La respuesta no contiene la propiedad "estado".');
      }
    });
  }
  
  toggleEstado1() {
    this.estado1 = !this.estado1;

    const endpoint = this.estado1
      ? 'https://apiriego.onrender.com/actualizarEstado/67bb6f2e85118d10af317f79'
      : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb6f2e85118d10af317f79';

    this.http.put(endpoint, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(response => {
          console.log('Estado actualizado:', response);
          this.mostrarAlerta('Estado actualizado', `El sistema está ${this.estado1 ? 'Activado' : 'Desactivado'}.`);
        }, error => {
          console.error('Error al actualizar estado:', error);
          this.mostrarAlerta('Error', 'Hubo un problema al actualizar el estado.');
        });
  }

  toggleEstado2() {
    this.estado2 = !this.estado2;

    const endpoint = this.estado2
      ? 'https://apiriego.onrender.com/actualizarEstado/67bb79ac1c82e9d42d445882'
      : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb79ac1c82e9d42d445882';

    this.http.put(endpoint, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(response => {
          console.log('Estado actualizado:', response);
          this.mostrarAlerta('Estado actualizado', `El sistema está ${this.estado2 ? 'Activado' : 'Desactivado'}.`);
        }, error => {
          console.error('Error al actualizar estado:', error);
          this.mostrarAlerta('Error', 'Hubo un problema al actualizar el estado.');
        });
  }

  stateConfiguracion() {
    this.http.put(`https://apiriego.onrender.com/actualizarEstado/67bb6f2e85118d10af317f79`, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(response => {
        console.log('Estado actualizado:', response);
        this.mostrarAlerta('Estado actualizado', 'Se ha actualizado el estado de la configuración.');
      }, error => {
        console.error('Error al actualizar estado:', error);
        this.mostrarAlerta('Error al actualizar estado', 'Hubo un problema al actualizar el estado de la configuración.');
      });
  }

  stateConfiguracion2() {
    this.http.put(`https://apiriego.onrender.com/actualizarEstado/67bb79ac1c82e9d42d445882`, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(response => {
        console.log('Estado actualizado:', response);
        this.mostrarAlerta('Estado actualizado', 'Se ha actualizado el estado de la configuración.');
      }, error => {
        console.error('Error al actualizar estado:', error);
        this.mostrarAlerta('Error al actualizar estado', 'Hubo un problema al actualizar el estado de la configuración.');
      });
  }

  mostrarAlerta(titulo: string, mensaje: string) {
    alert(`${titulo}\n${mensaje}`);
  }
}