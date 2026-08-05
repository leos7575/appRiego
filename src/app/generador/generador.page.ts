import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
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
  constructOutline,
  personCircleOutline
} from 'ionicons/icons';
import { 
  IonContent, 
  IonHeader,  
  IonToolbar, 
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-generador',
  templateUrl: './generador.page.html',
  styleUrls: ['./generador.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent, 
    IonHeader,  
    IonToolbar, 
    IonIcon,
    IonButton,
    TranslatePipe
  ]
})
export class GeneradorPage {
  
  estadoActual = signal<string>('Funcionando');

  medicionesFuturas = signal({
    voltaje: '-- V',
    corriente: '-- A',
    potencia: '-- W',
    rpm: '-- RPM'
  });

  historialMantenimiento = signal([
    {
      fecha: '17 jul 2026',
      responsable: 'Persona 9',
      observaciones: 'GENERADOR.OBSERVATION_1',
      proximaFecha: '17 ago 2026'
    },
    {
      fecha: '15 jun 2026',
      responsable: 'Persona 10',
      observaciones: 'GENERADOR.OBSERVATION_2',
      proximaFecha: '15 jul 2026'
    }
  ]);

  ionViewWillEnter() {
    addIcons({
      flashOutline,
      pulseOutline,
      speedometerOutline,
      hammerOutline,
      personOutline,
      calendarOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      constructOutline,
      personCircleOutline
    });
  }
}