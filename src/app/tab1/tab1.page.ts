import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../services/usuarios.service';

import { addIcons } from 'ionicons';
import { water } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    CommonModule
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
      water
    });
  }

  ngOnInit() {
    this.obtenerEstadoSector1();
    this.obtenerEstadoSector2();
  }

  obtenerEstadoSector1() {
    this.bd
      .getEstadoValvula('67bb6f2e85118d10af317f79')
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta completa estado1:', res);

          if (
            res &&
            res.Respuesta &&
            res.Respuesta.estado !== undefined
          ) {
            this.estado1 = res.Respuesta.estado;
            console.log('Estado1 asignado:', this.estado1);
          } else {
            console.warn(
              'La respuesta no contiene la propiedad "estado".'
            );
          }
        },
        error: (error) => {
          console.error(
            'Error al obtener el estado del Sector 1:',
            error
          );
        }
      });
  }

  obtenerEstadoSector2() {
    this.bd
      .getEstadoValvula('67bb79ac1c82e9d42d445882')
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta completa estado2:', res);

          if (
            res &&
            res.Respuesta &&
            res.Respuesta.estado !== undefined
          ) {
            this.estado2 = res.Respuesta.estado;
            console.log('Estado2 asignado:', this.estado2);
          } else {
            console.warn(
              'La respuesta no contiene la propiedad "estado".'
            );
          }
        },
        error: (error) => {
          console.error(
            'Error al obtener el estado del Sector 2:',
            error
          );
        }
      });
  }

  toggleEstado1() {
    this.estado1 = !this.estado1;

    const endpoint = this.estado1
      ? 'https://apiriego.onrender.com/actualizarEstado/67bb6f2e85118d10af317f79'
      : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb6f2e85118d10af317f79';

    this.http.put(endpoint, {}).subscribe({
      next: (response) => {
        console.log('Estado actualizado:', response);

        this.mostrarAlerta(
          'Estado actualizado',
          `El Sector 1 está ${
            this.estado1 ? 'activado' : 'desactivado'
          }.`
        );
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);

        // Regresa visualmente al estado anterior.
        this.estado1 = !this.estado1;

        this.mostrarAlerta(
          'Error',
          'Hubo un problema al actualizar el Sector 1.'
        );
      }
    });
  }

  toggleEstado2() {
    this.estado2 = !this.estado2;

    const endpoint = this.estado2
      ? 'https://apiriego.onrender.com/actualizarEstado/67bb79ac1c82e9d42d445882'
      : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb79ac1c82e9d42d445882';

    this.http.put(endpoint, {}).subscribe({
      next: (response) => {
        console.log('Estado actualizado:', response);

        this.mostrarAlerta(
          'Estado actualizado',
          `El Sector 2 está ${
            this.estado2 ? 'activado' : 'desactivado'
          }.`
        );
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);

        // Regresa visualmente al estado anterior.
        this.estado2 = !this.estado2;

        this.mostrarAlerta(
          'Error',
          'Hubo un problema al actualizar el Sector 2.'
        );
      }
    });
  }

  mostrarAlerta(titulo: string, mensaje: string) {
    alert(`${titulo}\n${mensaje}`);
  }

}