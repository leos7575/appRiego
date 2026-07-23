import { Component, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { 
  flashOutline, 
  pulseOutline, 
  speedometerOutline, 
  hammerOutline, 
  personOutline, 
  calendarOutline, 
  checkmarkCircleOutline,
  alertCircleOutline,
  constructOutline
} from 'ionicons/icons';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-generador',
  templateUrl: './generador.page.html',
  styleUrls: ['./generador.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonIcon
  ]
})
export class GeneradorPage {

  // Signals reactivos con los datos requeridos por el plan de trabajo del Equipo 5
  estadoActual = signal<string>('Funcionando'); // Puede ser: 'Funcionando', 'Detenido', 'En mantenimiento'

  // Telemetría vacía por el momento (mediciones futuras sin datos inventados)[cite: 1]
  medicionesFuturas = signal({
    voltaje: '-- V',
    corriente: '-- A',
    potencia: '-- W',
    rpm: '-- RPM'
  });

  // Historial basado en las tareas de revisión física del generador[cite: 1]
  historialMantenimiento = signal([
    {
      fecha: '17 jul 2026',
      responsable: 'Persona 9',
      observaciones: 'Revisión estructural: soporte del alternador, eje y balero axial estables. Sin vibraciones anormales.',
      proximaFecha: '17 ago 2026'
    },
    {
      fecha: '15 jun 2026',
      responsable: 'Persona 10',
      observaciones: 'Alineación de aspas, verificación de chumaceras y refuerzo de la protección contra lluvia.',
      proximaFecha: '15 jul 2026'
    }
  ]);

  constructor() {
    // Registro de iconos obligatorios para Standalone
    addIcons({
      flashOutline,
      pulseOutline,
      speedometerOutline,
      hammerOutline,
      personOutline,
      calendarOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      constructOutline
    });
  }
}