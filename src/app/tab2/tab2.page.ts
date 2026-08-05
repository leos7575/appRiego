import {
  Component,
  inject
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  ToastController
} from '@ionic/angular';

import {
  addIcons
} from 'ionicons';

import {
  personCircleOutline
} from 'ionicons/icons';

import {
  IonHeader,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonInput,
  IonIcon
} from '@ionic/angular/standalone';

import {
  UsuariosService
} from '../services/usuarios.service';

addIcons({
  personCircleOutline
});

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonHeader,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonInput,
    IonIcon
  ]
})
export class Tab2Page {

  private readonly sectorService =
    inject(UsuariosService);

  private readonly toastController =
    inject(ToastController);

  modoConfiguracion:
    'manual' | 'inteligente' = 'manual';

  modoInteligenteSector1Activo = false;
  modoInteligenteSector2Activo = false;

  lecturasSector1 = {
    humedad: 35,
    temperatura: 29,
    lluvia: true
  };

  lecturasSector2 = {
    humedad: 62,
    temperatura: 29,
    lluvia: false
  };

  configuracion: ConfiguracionSector = {
    fechaInicio: this.getLocalDate(),
    fechaFin: this.getLocalDate(),
    duracion: 0,
    dias: [],
    horaInicio:
      this.getFormattedCurrentTime(),
    pausas: 0,
    duracionPausa: 0,
    estado: false,
    pausasHis: 0,
    duracionPausaHis: 0
  };

  configuracion2: ConfiguracionSector = {
    fechaInicio: this.getLocalDate(),
    fechaFin: this.getLocalDate(),
    duracion: 0,
    dias: [],
    horaInicio:
      this.getFormattedCurrentTime(),
    pausas: 0,
    duracionPausa: 0,
    estado: false,
    pausasHis: 0,
    duracionPausaHis: 0
  };

  diasSector1: Dia[] = [
    { nombre: 'Lunes', selected: false },
    { nombre: 'Martes', selected: false },
    { nombre: 'Miércoles', selected: false },
    { nombre: 'Jueves', selected: false },
    { nombre: 'Viernes', selected: false },
    { nombre: 'Sábado', selected: false },
    { nombre: 'Domingo', selected: false }
  ];

  diasSector2: Dia[] = [
    { nombre: 'Lunes', selected: false },
    { nombre: 'Martes', selected: false },
    { nombre: 'Miércoles', selected: false },
    { nombre: 'Jueves', selected: false },
    { nombre: 'Viernes', selected: false },
    { nombre: 'Sábado', selected: false },
    { nombre: 'Domingo', selected: false }
  ];

  cambiarModo(
    modo: 'manual' | 'inteligente'
  ): void {
    this.modoConfiguracion = modo;
  }

  actualizarNumero(
    sector: 1 | 2,
    campo: CampoNumerico,
    evento: any
  ): void {
    const valorIngresado =
      evento.detail.value;

    const valorNumerico =
      Number(valorIngresado ?? 0);

    const configuracionSeleccionada =
      sector === 1
        ? this.configuracion
        : this.configuracion2;

    configuracionSeleccionada[campo] =
      Number.isNaN(valorNumerico)
        ? 0
        : valorNumerico;
  }

  activarModoInteligenteSector1(): void {
    this.modoInteligenteSector1Activo =
      !this.modoInteligenteSector1Activo;

    const estado =
      this.modoInteligenteSector1Activo
        ? 'activado'
        : 'desactivado';

    this.mostrarToast(
      `El modo inteligente del Sector 1 fue ${estado}.`,
      'success'
    );
  }

  activarModoInteligenteSector2(): void {
    this.modoInteligenteSector2Activo =
      !this.modoInteligenteSector2Activo;

    const estado =
      this.modoInteligenteSector2Activo
        ? 'activado'
        : 'desactivado';

    this.mostrarToast(
      `El modo inteligente del Sector 2 fue ${estado}.`,
      'success'
    );
  }

  toggleDia(dia: Dia): void {
    dia.selected = !dia.selected;
    this.onDiasFinChangeSector1();
  }

  toggleDia2(dia: Dia): void {
    dia.selected = !dia.selected;
    this.onDiasFinChangeSector2();
  }

  getPrimeraLetra(
    dia: string
  ): string {
    return dia.charAt(0);
  }

  guardar(
    idSector: string
  ): void {
    if (!idSector) {
      this.mostrarToast(
        'No se proporcionó un ID para actualizar.',
        'error'
      );

      return;
    }

    const configuracionActualizada = {
      fechaInicio:
        this.configuracion.fechaInicio,

      fechaFin:
        this.configuracion.fechaFin,

      duracion:
        this.configuracion.duracion,

      dias:
        this.configuracion.dias,

      horaInicio:
        this.configuracion.horaInicio,

      pausas:
        this.configuracion.pausas,

      duracionPausa:
        this.configuracion.duracionPausa,

      estado:
        this.configuracion.estado,

      pausasHis:
        this.configuracion.pausas,

      duracionPausaHis:
        this.configuracion.duracionPausa
    };

    console.log(
      'Datos del Sector 1 a actualizar:',
      configuracionActualizada
    );

    this.sectorService
      .putSector1(
        idSector,
        configuracionActualizada
      )
      .subscribe({
        next: (res: any) => {
          console.log(
            'Sector 1 actualizado:',
            res
          );

          this.mostrarToast(
            'El Sector 1 se actualizó correctamente.',
            'success'
          );
        },

        error: (err: any) => {
          console.error(
            'Error al actualizar el Sector 1:',
            err
          );

          this.mostrarToast(
            'Hubo un problema al actualizar el Sector 1.',
            'error'
          );
        }
      });
  }

  guardar2(
    idSector: string
  ): void {
    if (!idSector) {
      this.mostrarToast(
        'No se proporcionó un ID para actualizar.',
        'error'
      );

      return;
    }

    const configuracionActualizada2 = {
      fechaInicio:
        this.configuracion2.fechaInicio,

      fechaFin:
        this.configuracion2.fechaFin,

      duracion:
        this.configuracion2.duracion,

      dias:
        this.configuracion2.dias,

      horaInicio:
        this.configuracion2.horaInicio,

      pausas:
        this.configuracion2.pausas,

      duracionPausa:
        this.configuracion2.duracionPausa,

      estado:
        this.configuracion2.estado,

      pausasHis:
        this.configuracion2.pausas,

      duracionPausaHis:
        this.configuracion2.duracionPausa
    };

    console.log(
      'Datos del Sector 2 a actualizar:',
      configuracionActualizada2
    );

    this.sectorService
      .putSector1(
        idSector,
        configuracionActualizada2
      )
      .subscribe({
        next: (res: any) => {
          console.log(
            'Sector 2 actualizado:',
            res
          );

          this.mostrarToast(
            'El Sector 2 se actualizó correctamente.',
            'success'
          );
        },

        error: (err: any) => {
          console.error(
            'Error al actualizar el Sector 2:',
            err
          );

          this.mostrarToast(
            'Hubo un problema al actualizar el Sector 2.',
            'error'
          );
        }
      });
  }

  onFechaInicioChange(
    evento: any
  ): void {
    this.configuracion.fechaInicio =
      this.formatDate(
        evento.detail.value
      );
  }

  onFechaInicioChange2(
    evento: any
  ): void {
    this.configuracion2.fechaInicio =
      this.formatDate(
        evento.detail.value
      );
  }

  onFechaFinChange(
    evento: any
  ): void {
    this.configuracion.fechaFin =
      this.formatDate(
        evento.detail.value
      );
  }

  onFechaFinChange2(
    evento: any
  ): void {
    this.configuracion2.fechaFin =
      this.formatDate(
        evento.detail.value
      );
  }

  onHoraInicioChange(
    evento: any
  ): void {
    this.configuracion.horaInicio =
      this.formatTime(
        evento.detail.value
      );
  }

  onHoraInicioChange2(
    evento: any
  ): void {
    this.configuracion2.horaInicio =
      this.formatTime(
        evento.detail.value
      );
  }

  onDiasFinChangeSector1(): void {
    this.configuracion.dias =
      this.diasSector1
        .filter((dia) => dia.selected)
        .map((dia) => dia.nombre);
  }

  onDiasFinChangeSector2(): void {
    this.configuracion2.dias =
      this.diasSector2
        .filter((dia) => dia.selected)
        .map((dia) => dia.nombre);
  }

  formatDate(
    dateString: string
  ): string {
    const date =
      new Date(dateString);

    const year =
      date.getFullYear();

    const month =
      ('0' + (date.getMonth() + 1))
        .slice(-2);

    const day =
      ('0' + date.getDate())
        .slice(-2);

    return `${year}-${month}-${day}`;
  }

  formatTime(
    timeString: string
  ): string {
    const date =
      new Date(timeString);

    let hours =
      date.getHours();

    const minutes =
      ('0' + date.getMinutes())
        .slice(-2);

    const ampm =
      hours >= 12
        ? 'PM'
        : 'AM';

    hours = hours % 12;
    hours = hours || 12;

    return (
      `${('0' + hours).slice(-2)}` +
      `:${minutes} ${ampm}`
    );
  }

  getFormattedCurrentTime(): string {
    const date =
      new Date();

    let hours =
      date.getHours();

    const minutes =
      ('0' + date.getMinutes())
        .slice(-2);

    const ampm =
      hours >= 12
        ? 'PM'
        : 'AM';

    hours = hours % 12;
    hours = hours || 12;

    return (
      `${('0' + hours).slice(-2)}` +
      `:${minutes} ${ampm}`
    );
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

  getLocalDate(): string {
    const date =
      new Date();

    date.setMinutes(
      date.getMinutes() -
      date.getTimezoneOffset()
    );

    return date
      .toISOString()
      .split('T')[0];
  }
}

interface ConfiguracionSector {
  estado: boolean;
  fechaInicio: string;
  fechaFin: string;
  duracion: number;
  dias: string[];
  horaInicio: string;
  pausas: number;
  duracionPausa: number;
  pausasHis: number;
  duracionPausaHis: number;
}

type CampoNumerico =
  | 'duracion'
  | 'pausas'
  | 'duracionPausa';

interface Dia {
  nombre: string;
  selected: boolean;
}