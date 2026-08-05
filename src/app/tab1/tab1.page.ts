import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  HttpClient
} from '@angular/common/http';

import {
  ToastController
} from '@ionic/angular';

import {
  IonHeader,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import {
  UsuariosService
} from '../services/usuarios.service';

import {
  addIcons
} from 'ionicons';

import {
  water,
  personCircleOutline
} from 'ionicons/icons';

addIcons({
  water,
  personCircleOutline
});

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonHeader,
    IonContent,
    IonButton,
    IonIcon,
    TranslatePipe
  ]
})
export class Tab1Page implements OnInit {

  private readonly http =
    inject(HttpClient);

  private readonly usuariosService =
    inject(UsuariosService);

  private readonly toastController =
    inject(ToastController);

  private readonly translate =
    inject(TranslateService);

  estado1 = false;
  estado2 = false;

  ngOnInit(): void {
    this.obtenerEstadoSector1();
    this.obtenerEstadoSector2();
  }

  obtenerEstadoSector1(): void {
    this.usuariosService
      .getEstadoValvula(
        '67bb6f2e85118d10af317f79'
      )
      .subscribe({
        next: (res: any) => {
          console.log(
            'Respuesta completa estado1:',
            res
          );

          const estadoRecibido =
            res?.Respuesta?.estado;

          if (estadoRecibido !== undefined) {
            this.estado1 =
              Boolean(estadoRecibido);

            console.log(
              'Estado1 asignado:',
              this.estado1
            );
          } else {
            console.warn(
              'La respuesta no contiene la propiedad "estado".'
            );
          }
        },

        error: (error: any) => {
          console.error(
            'Error al obtener el estado del Sector 1:',
            error
          );

          this.mostrarToast(
            this.translate.instant('TAB1.ERR_GET_STATUS_1'),
            'error'
          );
        }
      });
  }

  obtenerEstadoSector2(): void {
    this.usuariosService
      .getEstadoValvula(
        '67bb79ac1c82e9d42d445882'
      )
      .subscribe({
        next: (res: any) => {
          console.log(
            'Respuesta completa estado2:',
            res
          );

          const estadoRecibido =
            res?.Respuesta?.estado;

          if (estadoRecibido !== undefined) {
            this.estado2 =
              Boolean(estadoRecibido);

            console.log(
              'Estado2 asignado:',
              this.estado2
            );
          } else {
            console.warn(
              'La respuesta no contiene la propiedad "estado".'
            );
          }
        },

        error: (error: any) => {
          console.error(
            'Error al obtener el estado del Sector 2:',
            error
          );

          this.mostrarToast(
            this.translate.instant('TAB1.ERR_GET_STATUS_2'),
            'error'
          );
        }
      });
  }

  toggleEstado1(): void {
    this.estado1 = !this.estado1;

    const endpoint =
      this.estado1
        ? 'https://apiriego.onrender.com/actualizarEstado/67bb6f2e85118d10af317f79'
        : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb6f2e85118d10af317f79';

    this.http.put(endpoint, {}).subscribe({
      next: (response: any) => {
        console.log(
          'Estado actualizado:',
          response
        );

        const statusStr = this.estado1
          ? this.translate.instant('TAB1.STATUS_ACTIVATED')
          : this.translate.instant('TAB1.STATUS_DEACTIVATED');

        this.mostrarToast(
          this.translate.instant('TAB1.SECTOR_STATUS_UPDATED', { sector: '1', status: statusStr }),
          'success'
        );
      },

      error: (error: any) => {
        console.error(
          'Error al actualizar estado:',
          error
        );

        // Recupera el estado anterior
        this.estado1 = !this.estado1;

        this.mostrarToast(
          this.translate.instant('TAB1.ERR_UPDATE_STATUS_1'),
          'error'
        );
      }
    });
  }

  toggleEstado2(): void {
    this.estado2 = !this.estado2;

    const endpoint =
      this.estado2
        ? 'https://apiriego.onrender.com/actualizarEstado/67bb79ac1c82e9d42d445882'
        : 'https://apiriego.onrender.com/actualizarEstadoFalse/67bb79ac1c82e9d42d445882';

    this.http.put(endpoint, {}).subscribe({
      next: (response: any) => {
        console.log(
          'Estado actualizado:',
          response
        );

        const statusStr = this.estado2
          ? this.translate.instant('TAB1.STATUS_ACTIVATED')
          : this.translate.instant('TAB1.STATUS_DEACTIVATED');

        this.mostrarToast(
          this.translate.instant('TAB1.SECTOR_STATUS_UPDATED', { sector: '2', status: statusStr }),
          'success'
        );
      },

      error: (error: any) => {
        console.error(
          'Error al actualizar estado:',
          error
        );

        // Recupera el estado anterior
        this.estado2 = !this.estado2;

        this.mostrarToast(
          this.translate.instant('TAB1.ERR_UPDATE_STATUS_2'),
          'error'
        );
      }
    });
  }

  async mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error'
  ): Promise<void> {
    const toast =
      await this.toastController.create({
        message: mensaje,
        duration: 2200,
        position: 'top',
        icon:
          tipo === 'success'
            ? 'checkmark-circle'
            : 'close-circle',
        cssClass:
          tipo === 'success'
            ? 'toast-success'
            : 'toast-error'
      });

    await toast.present();
  }
}