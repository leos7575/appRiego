import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
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

import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
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

  /* ========================================
     MODO DE CONFIGURACIÓN
  ======================================== */

  modoConfiguracion: 'manual' | 'inteligente' = 'manual';

  modoInteligenteSector1Activo = false;
modoInteligenteSector2Activo = false;

/* Datos temporales del Sector 1 */
lecturasSector1 = {
  humedad: 35,
  temperatura: 29,
  lluvia: true
};

/* Datos temporales del Sector 2 */
lecturasSector2 = {
  humedad: 62,
  temperatura: 29,
  lluvia: false
};

  /* ========================================
     CONFIGURACIÓN DEL SECTOR 1
  ======================================== */

  configuracion: {
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
  } = {
    fechaInicio: this.getLocalDate(),
    fechaFin: this.getLocalDate(),
    duracion: 0,
    dias: [],
    horaInicio: this.getFormattedCurrentTime(),
    pausas: 0,
    duracionPausa: 0,
    estado: false,
    pausasHis: 0,
    duracionPausaHis: 0
  };

  /* ========================================
     CONFIGURACIÓN DEL SECTOR 2
  ======================================== */

  configuracion2: {
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
  } = {
    fechaInicio: this.getLocalDate(),
    fechaFin: this.getLocalDate(),
    duracion: 0,
    dias: [],
    horaInicio: this.getFormattedCurrentTime(),
    pausas: 0,
    duracionPausa: 0,
    estado: false,
    pausasHis: 0,
    duracionPausaHis: 0
  };

  /* ========================================
     DÍAS DEL SECTOR 1
  ======================================== */

  diasSector1: Dia[] = [
    { nombre: 'Lunes', selected: false },
    { nombre: 'Martes', selected: false },
    { nombre: 'Miercoles', selected: false },
    { nombre: 'Jueves', selected: false },
    { nombre: 'Viernes', selected: false },
    { nombre: 'Sabado', selected: false },
    { nombre: 'Domingo', selected: false }
  ];

  /* ========================================
     DÍAS DEL SECTOR 2
  ======================================== */

  diasSector2: Dia[] = [
    { nombre: 'Lunes', selected: false },
    { nombre: 'Martes', selected: false },
    { nombre: 'Miercoles', selected: false },
    { nombre: 'Jueves', selected: false },
    { nombre: 'Viernes', selected: false },
    { nombre: 'Sabado', selected: false },
    { nombre: 'Domingo', selected: false }
  ];

  constructor(
    private Sector: UsuariosService
  ) {
    addIcons({
      personCircleOutline
    });
  }

  ngOnInit() {}

  /* ========================================
     CAMBIAR MODO
  ======================================== */

  cambiarModo(modo: 'manual' | 'inteligente') {
    this.modoConfiguracion = modo;
  }

  /* ========================================
     ACTIVAR O DESACTIVAR MODELO
  ======================================== */

  activarModoInteligenteSector1() {
  this.modoInteligenteSector1Activo =
    !this.modoInteligenteSector1Activo;

  const estado = this.modoInteligenteSector1Activo
    ? 'activado'
    : 'desactivado';

  this.mostrarAlerta(
    `Modo inteligente ${estado}`,
    `El control inteligente del Sector 1 fue ${estado}.`
  );
}

activarModoInteligenteSector2() {
  this.modoInteligenteSector2Activo =
    !this.modoInteligenteSector2Activo;

  const estado = this.modoInteligenteSector2Activo
    ? 'activado'
    : 'desactivado';

  this.mostrarAlerta(
    `Modo inteligente ${estado}`,
    `El control inteligente del Sector 2 fue ${estado}.`
  );
}

  /* ========================================
     SELECCIÓN DE DÍAS
  ======================================== */

  toggleDia(dia: Dia) {
    dia.selected = !dia.selected;

    this.onDiasFinChangeSector1();
  }

  toggleDia2(dia: Dia) {
    dia.selected = !dia.selected;

    this.onDiasFinChangeSector2();
  }

  getPrimeraLetra(dia: string): string {
    return dia.charAt(0);
  }

  /* ========================================
     GUARDAR SECTOR 1
  ======================================== */

  guardar(idSector: string) {
    if (!idSector) {
      this.mostrarAlerta(
        'Error',
        'No se proporcionó un ID para actualizar.'
      );

      return;
    }

    const configuracionActualizada = {
      fechaInicio: this.configuracion.fechaInicio,
      fechaFin: this.configuracion.fechaFin,
      duracion: this.configuracion.duracion,
      dias: this.configuracion.dias,
      horaInicio: this.configuracion.horaInicio,
      pausas: this.configuracion.pausas,
      duracionPausa: this.configuracion.duracionPausa,
      estado: this.configuracion.estado,

      pausasHis: this.configuracion.pausas,

      duracionPausaHis:
        this.configuracion.duracionPausa
    };

    console.log(
      'Datos del Sector 1 a actualizar:',
      configuracionActualizada
    );

    this.Sector
      .putSector1(idSector, configuracionActualizada)
      .subscribe({
        next: (res: any) => {
          console.log(
            'Sector 1 actualizado:',
            res
          );

          this.mostrarAlerta(
            'Sector actualizado correctamente',
            'El Sector 1 se actualizó con éxito.'
          );
        },

        error: (err: any) => {
          console.error(
            'Error al actualizar el Sector 1:',
            err
          );

          this.mostrarAlerta(
            'Error al actualizar sector',
            'Hubo un problema al actualizar el Sector 1.'
          );
        }
      });
  }

  /* ========================================
     GUARDAR SECTOR 2
  ======================================== */

  guardar2(idSector: string) {
    if (!idSector) {
      this.mostrarAlerta(
        'Error',
        'No se proporcionó un ID para actualizar.'
      );

      return;
    }

    const configuracionActualizada2 = {
      fechaInicio: this.configuracion2.fechaInicio,
      fechaFin: this.configuracion2.fechaFin,
      duracion: this.configuracion2.duracion,
      dias: this.configuracion2.dias,
      horaInicio: this.configuracion2.horaInicio,
      pausas: this.configuracion2.pausas,
      duracionPausa:
        this.configuracion2.duracionPausa,

      estado: this.configuracion2.estado,

      pausasHis:
        this.configuracion2.pausas,

      duracionPausaHis:
        this.configuracion2.duracionPausa
    };

    console.log(
      'Datos del Sector 2 a actualizar:',
      configuracionActualizada2
    );

    this.Sector
      .putSector1(idSector, configuracionActualizada2)
      .subscribe({
        next: (res: any) => {
          console.log(
            'Sector 2 actualizado:',
            res
          );

          this.mostrarAlerta(
            'Sector actualizado correctamente',
            'El Sector 2 se actualizó con éxito.'
          );
        },

        error: (err: any) => {
          console.error(
            'Error al actualizar el Sector 2:',
            err
          );

          this.mostrarAlerta(
            'Error al actualizar sector',
            'Hubo un problema al actualizar el Sector 2.'
          );
        }
      });
  }

  /* ========================================
     CAMBIOS DE FECHA
  ======================================== */

  onFechaInicioChange(event: any) {
    this.configuracion.fechaInicio =
      this.formatDate(event.detail.value);
  }

  onFechaInicioChange2(event: any) {
    this.configuracion2.fechaInicio =
      this.formatDate(event.detail.value);
  }

  onFechaFinChange(event: any) {
    this.configuracion.fechaFin =
      this.formatDate(event.detail.value);
  }

  onFechaFinChange2(event: any) {
    this.configuracion2.fechaFin =
      this.formatDate(event.detail.value);
  }

  /* ========================================
     CAMBIOS DE HORA
  ======================================== */

  onHoraInicioChange(event: any) {
    this.configuracion.horaInicio =
      this.formatTime(event.detail.value);
  }

  onHoraInicioChange2(event: any) {
    this.configuracion2.horaInicio =
      this.formatTime(event.detail.value);
  }

  /* ========================================
     GUARDAR DÍAS SELECCIONADOS
  ======================================== */

  onDiasFinChangeSector1() {
    this.configuracion.dias =
      this.diasSector1
        .filter((dia) => dia.selected)
        .map((dia) => dia.nombre);
  }

  onDiasFinChangeSector2() {
    this.configuracion2.dias =
      this.diasSector2
        .filter((dia) => dia.selected)
        .map((dia) => dia.nombre);
  }

  /* ========================================
     FORMATEAR FECHA
  ======================================== */

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();

    const month =
      ('0' + (date.getMonth() + 1)).slice(-2);

    const day =
      ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  /* ========================================
     FORMATEAR HORA
  ======================================== */

  formatTime(timeString: string): string {
    const date = new Date(timeString);

    let hours = date.getHours();

    const minutes =
      ('0' + date.getMinutes()).slice(-2);

    const ampm =
      hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${('0' + hours).slice(-2)}:${minutes} ${ampm}`;
  }

  /* ========================================
     OBTENER HORA ACTUAL
  ======================================== */

  getFormattedCurrentTime(): string {
    const date = new Date();

    let hours = date.getHours();

    const minutes =
      ('0' + date.getMinutes()).slice(-2);

    const ampm =
      hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${('0' + hours).slice(-2)}:${minutes} ${ampm}`;
  }

  /* ========================================
     MOSTRAR ALERTA
  ======================================== */

  mostrarAlerta(
    titulo: string,
    mensaje: string
  ) {
    alert(`${titulo}\n${mensaje}`);
  }

  /* ========================================
     OBTENER FECHA LOCAL
  ======================================== */

  getLocalDate(): string {
    const date = new Date();

    date.setMinutes(
      date.getMinutes() -
      date.getTimezoneOffset()
    );

    return date
      .toISOString()
      .split('T')[0];
  }
}

/* ========================================
   INTERFAZ DE LOS DÍAS
======================================== */

interface Dia {
  nombre: string;
  selected: boolean;
}