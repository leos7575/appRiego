<<<<<<< Updated upstream
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg,IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
=======
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
>>>>>>> Stashed changes
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';

<<<<<<< Updated upstream
=======
import { addIcons } from 'ionicons';
import {
  water,
  trashOutline,
  addCircleOutline
} from 'ionicons/icons';
>>>>>>> Stashed changes

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
<<<<<<< Updated upstream
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, CommonModule, FormsModule,],
=======
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule
  ],
>>>>>>> Stashed changes
})
export class Tab1Page {

<<<<<<< Updated upstream
  estado1:any;
  estado2:any;
=======
  estado1: any;
  estado2: any;

  constructor(
    private http: HttpClient,
    private bd: UsuariosService
  ) {

    addIcons({
      water,
      trashOutline,
      addCircleOutline
    });

  }
>>>>>>> Stashed changes

  constructor(private http: HttpClient, private bd:UsuariosService) {}
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
<<<<<<< Updated upstream
  
  
  // enviarConfiguracion() {
  //   // Obtener la configuración desde la API
  //   this.http.get<any>('https://apiriego.onrender.com/config1/67bb6f2e85118d10af317f79').subscribe(
  //     (config) => {
  //       console.log('Configuración obtenida:', config);

  //       // Enviar la configuración al ESP32
  //       this.http.post('http://192.168.118.231/configurar', config).subscribe(
  //         (res) => console.log('Configuración enviada al ESP32:', res),
  //         (error) => console.error('Error al enviar configuración:', error)
  //       );
  //     },
  //     (error) => console.error('Error al obtener configuración:', error)
  //   );
  // }
  toggleEstado1() {
    this.estado1 = !this.estado1; // Alternar estado
=======

  toggleEstado1() {

    this.estado1 = !this.estado1;
>>>>>>> Stashed changes

    const endpoint = this.estado1
      ? 'https://apiriego.onrender.com/actualizarEstado/67bb6f2e85118d10af317f79'
      : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb6f2e85118d10af317f79';

    this.http.put(endpoint, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(response => {

      console.log('Estado actualizado:', response);

      this.mostrarAlerta(
        'Estado actualizado',
        `El sistema está ${this.estado1 ? 'Activado' : 'Desactivado'}.`
      );

    }, error => {

      console.error('Error al actualizar estado:', error);

      this.mostrarAlerta(
        'Error',
        'Hubo un problema al actualizar el estado.'
      );

    });

  }
  toggleEstado2() {
<<<<<<< Updated upstream
    this.estado2 = !this.estado2; // Alternar estado
=======

    this.estado2 = !this.estado2;
>>>>>>> Stashed changes

    const endpoint = this.estado2
      ? 'https://apiriego.onrender.com/actualizarEstado/67bb79ac1c82e9d42d445882'
      : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb79ac1c82e9d42d445882';

    this.http.put(endpoint, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(response => {

      console.log('Estado actualizado:', response);

      this.mostrarAlerta(
        'Estado actualizado',
        `El sistema está ${this.estado2 ? 'Activado' : 'Desactivado'}.`
      );

    }, error => {

      console.error('Error al actualizar estado:', error);

      this.mostrarAlerta(
        'Error',
        'Hubo un problema al actualizar el estado.'
      );

    });

  }

  stateConfiguracion() {
<<<<<<< Updated upstream
    this.http.put(`https://apiriego.onrender.com/actualizarEstado/67bb6f2e85118d10af317f79`,{
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(response => {
        console.log('Estado actualizado:', response);
        this.mostrarAlerta('Estado actualizado', 'Se ha actualizado el estado de la configuración.');
      }, error => {
        console.error('Error al actualizar estado:', error);
        this.mostrarAlerta('Error al actualizar estado', 'Hubo un problema al actualizar el estado de la configuración.');
      });
=======

    this.http.put(
      'https://apiriego.onrender.com/actualizarEstado/67bb6f2e85118d10af317f79',
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).subscribe(response => {

      console.log('Estado actualizado:', response);

      this.mostrarAlerta(
        'Estado actualizado',
        'Se ha actualizado el estado de la configuración.'
      );

    }, error => {

      console.error('Error al actualizar estado:', error);

      this.mostrarAlerta(
        'Error al actualizar estado',
        'Hubo un problema al actualizar el estado de la configuración.'
      );

    });

>>>>>>> Stashed changes
  }
  stateConfiguracion2() {
<<<<<<< Updated upstream
    this.http.put(`https://apiriego.onrender.com/actualizarEstado/67bb79ac1c82e9d42d445882`,{
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
=======

    this.http.put(
      'https://apiriego.onrender.com/actualizarEstado/67bb79ac1c82e9d42d445882',
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).subscribe(response => {

      console.log('Estado actualizado:', response);

      this.mostrarAlerta(
        'Estado actualizado',
        'Se ha actualizado el estado de la configuración.'
      );

    }, error => {

      console.error('Error al actualizar estado:', error);

      this.mostrarAlerta(
        'Error al actualizar estado',
        'Hubo un problema al actualizar el estado de la configuración.'
      );

    });

  }

  // ===============================
  // NUEVAS FUNCIONES (TEMPORALES)
  // ===============================

  agregarSector() {

    this.mostrarAlerta(
      'Próximamente',
      'Aquí podrás crear un nuevo sector.'
    );

  }

  eliminarSector(sector: number) {

    this.mostrarAlerta(
      'Próximamente',
      `Aquí podrás eliminar el Sector ${sector}.`
    );

  }

  // ===============================

  mostrarAlerta(titulo: string, mensaje: string) {

    alert(`${titulo}\n${mensaje}`);

  }

}
>>>>>>> Stashed changes
