import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg,IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, CommonModule, FormsModule,],
})
export class Tab1Page {

  estado1:any;
  estado2:any;

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
  
  
  // enviarConfiguracion() {
  //   // Obtener la configuración desde la API
  //   this.http.get<any>('https://api-riego-i0yt0iifo-leonardos-projects-2f92a5fc.vercel.app/config1/67bb6f2e85118d10af317f79').subscribe(
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

    const peticion = this.estado1
      ? this.bd.actualizarEstado('67bb6f2e85118d10af317f79')
      : this.bd.actualizarEstadoFalse('67bb6f2e85118d10af317f79');

    peticion.subscribe(response => {
          console.log('Estado actualizado:', response);
          this.mostrarAlerta('Estado actualizado', `El sistema está ${this.estado1 ? 'Activado' : 'Desactivado'}.`);
        }, error => {
          console.error('Error al actualizar estado:', error);
          this.mostrarAlerta('Error', 'Hubo un problema al actualizar el estado.');
        });
  }
  toggleEstado2() {
    this.estado2 = !this.estado2; // Alternar estado

    const peticion = this.estado2
      ? this.bd.actualizarEstado('67bb79ac1c82e9d42d445882')
      : this.bd.actualizarEstadoFalse('67bb79ac1c82e9d42d445882');

    peticion.subscribe(response => {
          console.log('Estado actualizado:', response);
          this.mostrarAlerta('Estado actualizado', `El sistema está ${this.estado2 ? 'Activado' : 'Desactivado'}.`);
        }, error => {
          console.error('Error al actualizar estado:', error);
          this.mostrarAlerta('Error', 'Hubo un problema al actualizar el estado.');
        });
  }

  stateConfiguracion() {
    this.bd.actualizarEstado('67bb6f2e85118d10af317f79').subscribe(response => {
        console.log('Estado actualizado:', response);
        this.mostrarAlerta('Estado actualizado', 'Se ha actualizado el estado de la configuración.');
      }, error => {
        console.error('Error al actualizar estado:', error);
        this.mostrarAlerta('Error al actualizar estado', 'Hubo un problema al actualizar el estado de la configuración.');
      });
  }
  stateConfiguracion2() {
    this.bd.actualizarEstado('67bb79ac1c82e9d42d445882').subscribe(response => {
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
