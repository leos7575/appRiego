import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { HttpClient } from '@angular/common/http';
import { UsuariosService } from '../services/usuarios.service';
import { _URL_API } from '../config/config';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../components/language-selector/language-selector.component';

import { ToastController } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { water, trashOutline, addCircleOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    TranslatePipe
  ],
})
export class Tab1Page {
  private readonly http = inject(HttpClient);
  private readonly bd = inject(UsuariosService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly toastController = inject(ToastController);

  estado1: any;
  estado2: any;

  async mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2200,
      position: 'top',
      icon: tipo === 'success' ? 'checkmark-circle' : 'close-circle',
      cssClass: tipo === 'success' ? 'toast-success' : 'toast-error'
    });
    await toast.present();
  }

  ionViewWillEnter() {
    addIcons({
      water,
      trashOutline,
      addCircleOutline,
      personCircleOutline
    });
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
    if (this.estado1) {
      // Si la válvula está activada -> DESACTIVAR (Paro de Emergencia en backend)
      const endpoint = `${_URL_API}paroEmergencia/67bb6f2e85118d10af317f79`;
      this.http.post(endpoint, {}).subscribe({
        next: (response) => {
          this.estado1 = false;
          console.log('Sector 1 desactivado:', response);
        },
        error: (error) => {
          console.error('Error al desactivar el Sector 1:', error);
          this.estado1 = false;
        }
      });
    } else {
      // Si la válvula está inactiva -> Redirigir al Tab de Configuración (/tabs/tab2)
      this.router.navigate(['/tabs/tab2']);
    }
  }

  toggleEstado2() {
    if (this.estado2) {
      // Si la válvula está activada -> DESACTIVAR (Paro de Emergencia en backend)
      const endpoint = `${_URL_API}paroEmergencia/67bb79ac1c82e9d42d445882`;
      this.http.post(endpoint, {}).subscribe({
        next: (response) => {
          this.estado2 = false;
          console.log('Sector 2 desactivado:', response);
        },
        error: (error) => {
          console.error('Error al desactivar el Sector 2:', error);
          this.estado2 = false;
        }
      });
    } else {
      // Si la válvula está inactiva -> Redirigir al Tab de Configuración (/tabs/tab2)
      this.router.navigate(['/tabs/tab2']);
    }
  }

  mostrarAlerta(titulo: string, mensaje: string) {
    this.mostrarToast(mensaje, 'success');
  }

}