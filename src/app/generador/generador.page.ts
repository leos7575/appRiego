import {
  Component,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  addIcons
} from 'ionicons';

import {
  flashOutline,
  pulseOutline,
  speedometerOutline,
  personOutline,
  calendarOutline,
  alertCircleOutline,
  constructOutline,
  personCircleOutline
} from 'ionicons/icons';

import {
  IonContent,
  IonHeader,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';

addIcons({
  flashOutline,
  pulseOutline,
  speedometerOutline,
  personOutline,
  calendarOutline,
  alertCircleOutline,
  constructOutline,
  personCircleOutline
});

@Component({
  selector: 'app-generador',
  templateUrl: './generador.page.html',
  styleUrls: ['./generador.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonIcon,
    IonButton
  ]
})
export class GeneradorPage {

  estadoActual =
    signal<string>(
      'Funcionando'
    );

  medicionesFuturas =
    signal({
      voltaje: '-- V',
      corriente: '-- A',
      potencia: '-- W',
      rpm: '-- RPM'
    });

  historialMantenimiento =
    signal([
      {
        fecha:
          '17 jul 2026',

        responsable:
          'Persona 9',

        observaciones:
          'Revisión estructural: soporte del alternador, eje y balero axial estables. Sin vibraciones anormales.',

        proximaFecha:
          '17 ago 2026'
      },
      {
        fecha:
          '15 jun 2026',

        responsable:
          'Persona 10',

        observaciones:
          'Alineación de aspas, verificación de chumaceras y refuerzo de la protección contra lluvia.',

        proximaFecha:
          '15 jul 2026'
      }
    ]);
}