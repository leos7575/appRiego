import { Component, inject } from '@angular/core';
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
  IonIcon,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';

import { HttpClient } from '@angular/common/http';
import { _URL_API } from '../config/config';
import { UsuariosService } from '../services/usuarios.service';
import { ToastController } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../components/language-selector/language-selector.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
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
    IonIcon,
    IonSelect,
    IonSelectOption,
    TranslatePipe,
    LanguageSelectorComponent
  ]
})
export class Tab2Page {
  private readonly Sector = inject(UsuariosService);
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly toastController = inject(ToastController);

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

  /* ========================================
     MODO DE CONFIGURACIÓN
  ======================================== */

  modoConfiguracion: 'manual' | 'inteligente' = 'manual';

  modoInteligenteSector1Activo = false;
  modoInteligenteSector2Activo = false;

  /* Decisiones reales calculadas por el modelo de IA en el servidor */
  decisionSector1Text: string = 'Cargando evaluación de la IA...';
  decisionSector2Text: string = 'Cargando evaluación de la IA...';

  /* Variables de Transparencia y Temporizadores */
  riegoEnEjecucion1 = false;
  timerSector1Seconds = 0;
  timerSector1Total = 0;
  timerSector1Formatted = '00:00';
  tiempoTranscurrido1Formatted = '00:00';
  timerSector1FaltanteBDFormatted = '00:00';
  timerInterval1: any = null;
  proximoRiegoSector1 = 'En la próxima hora';
  duracionRecomendadaIA1 = 0;
  mostrandoEdicion1 = false;

  riegoEnEjecucion2 = false;
  timerSector2Seconds = 0;
  timerSector2Total = 0;
  timerSector2Formatted = '00:00';
  tiempoTranscurrido2Formatted = '00:00';
  timerSector2FaltanteBDFormatted = '00:00';
  timerInterval2: any = null;
  proximoRiegoSector2 = 'En la próxima hora';
  duracionRecomendadaIA2 = 0;
  mostrandoEdicion2 = false;

  /* Lecturas en tiempo real del Sector 1 */
  lecturasSector1 = {
    humedad: 0,
    temperatura: 0,
    humedadAire: 50,
    lluvia: false
  };

  /* Lecturas en tiempo real del Sector 2 */
  lecturasSector2 = {
    humedad: 0,
    temperatura: 0,
    humedadAire: 50,
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
    modoRiego: string;
    cropType: string;
    cropGrowthStage: string;
    season: string;
    irrigationType: string;
    soilType: string;
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
    duracionPausaHis: 0,
    modoRiego: 'Manual',
    cropType: 'Jitomate',
    cropGrowthStage: 'Crecimiento',
    season: 'Lluvias',
    irrigationType: 'Goteo',
    soilType: 'Franco'
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
    modoRiego: string;
    cropType: string;
    cropGrowthStage: string;
    season: string;
    irrigationType: string;
    soilType: string;
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
    duracionPausaHis: 0,
    modoRiego: 'Manual',
    cropType: 'Jitomate',
    cropGrowthStage: 'Crecimiento',
    season: 'Lluvias',
    irrigationType: 'Goteo',
    soilType: 'Franco'
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

  autoPollingInterval: any;

  ionViewWillEnter() {
    addIcons({
      personCircleOutline
    });
    this.cargarConfiguraciones();
    this.iniciarAutoPolling();
  }

  ionViewWillLeave() {
    if (this.autoPollingInterval) {
      clearInterval(this.autoPollingInterval);
    }
  }

  iniciarAutoPolling() {
    if (this.autoPollingInterval) clearInterval(this.autoPollingInterval);
    this.autoPollingInterval = setInterval(() => {
      this.evaluarConIA(1);
      this.evaluarConIA(2);
    }, 3000);
  }

  /* ========================================
     EVALUACIÓN REAL CON MODELO DE IA
  ======================================== */

  evaluarConIA(sectorNum: number) {
    const id = sectorNum === 1 ? '67bb6f2e85118d10af317f79' : '67bb79ac1c82e9d42d445882';
    const lecturas = sectorNum === 1 ? this.lecturasSector1 : this.lecturasSector2;
    
    const payload = {
      temperature: lecturas.temperatura || 25.0,
      humidity: lecturas.humedadAire || 50.0,
      soil_moisture: 1023 - Math.round(((lecturas.humedad || 35) * 1023) / 100),
      lluvia: lecturas.lluvia ? 200 : 4095
    };

    this.http.post<any>(`${_URL_API}evaluar/${id}`, payload).subscribe({
      next: (res) => {
        if (res) {
          const minsModelo = res.proximoRiego?.minutosSugeridosIA ?? res.model_predicted_minutes ?? 0;
          const pred = res.proximoRiego?.nivelPredicho ?? res.prediccion ?? 'Media';
          const riegoActual = res.riegoActual || { activo: false };

          if (sectorNum === 1) {
            this.duracionRecomendadaIA1 = minsModelo;
            this.proximoRiegoSector1 = res.proximoRiego?.proximaHoraStr ?? (this.configuracion.irrigationType === 'Hidropónico' ? 'En el inicio de la próxima hora' : `A las ${this.configuracion.horaInicio}`);
          } else {
            this.duracionRecomendadaIA2 = minsModelo;
            this.proximoRiegoSector2 = res.proximoRiego?.proximaHoraStr ?? (this.configuracion2.irrigationType === 'Hidropónico' ? 'En el inicio de la próxima hora' : `A las ${this.configuracion2.horaInicio}`);
          }

          if (res.lluvia_override || (lecturas.lluvia && !riegoActual.activo)) {
            const txt = `Riego suspendido por lluvia (Sugerencia IA: ${minsModelo} min)`;
            if (sectorNum === 1) {
              this.decisionSector1Text = txt;
              this.detenerTimerLocal(1);
            } else {
              this.decisionSector2Text = txt;
              this.detenerTimerLocal(2);
            }
          } else if (riegoActual.activo || res.orden_encendido) {
            const dur = riegoActual.duracion || res.minutos_de_riego || minsModelo;
            const txt = `Riego en ejecución (${dur} min)`;
            if (sectorNum === 1) {
              this.decisionSector1Text = txt;
              this.duracionRecomendadaIA1 = dur;
            } else {
              this.decisionSector2Text = txt;
              this.duracionRecomendadaIA2 = dur;
            }

            const transSeg = riegoActual.transcurridoSegundos || 0;
            const faltSeg = riegoActual.faltanteSegundos || Math.round(dur * 60);

            this.sincronizarTimerLocal(sectorNum, dur, transSeg, faltSeg);
          } else if (minsModelo > 0) {
            const txt = `Riego recomendado: ${minsModelo} minutos (Nivel ${pred})`;
            if (sectorNum === 1) {
              this.decisionSector1Text = txt;
              this.detenerTimerLocal(1);
            } else {
              this.decisionSector2Text = txt;
              this.detenerTimerLocal(2);
            }
          } else {
            const txt = `No es necesario regar en este ciclo (Nivel ${pred})`;
            if (sectorNum === 1) {
              this.decisionSector1Text = txt;
              this.detenerTimerLocal(1);
            } else {
              this.decisionSector2Text = txt;
              this.detenerTimerLocal(2);
            }
          }
        }
      },
      error: (err) => {
        console.error(`Error al consultar IA Sector ${sectorNum}:`, err);
        const fallbackTxt = sectorNum === 1
          ? (this.lecturasSector1.lluvia ? 'No regar: se detectó lluvia' : this.lecturasSector1.humedad < 40 ? 'Se recomienda activar el riego' : 'No es necesario regar')
          : (this.lecturasSector2.lluvia ? 'No regar: se detectó lluvia' : this.lecturasSector2.humedad < 40 ? 'Se recomienda activar el riego' : 'No es necesario regar');
        if (sectorNum === 1) this.decisionSector1Text = fallbackTxt;
        else this.decisionSector2Text = fallbackTxt;
      }
    });
  }

  detenerTimerLocal(sectorNum: number) {
    if (sectorNum === 1) {
      this.riegoEnEjecucion1 = false;
      if (this.timerInterval1) {
        clearInterval(this.timerInterval1);
        this.timerInterval1 = null;
      }
    } else {
      this.riegoEnEjecucion2 = false;
      if (this.timerInterval2) {
        clearInterval(this.timerInterval2);
        this.timerInterval2 = null;
      }
    }
  }

  sincronizarTimerLocal(sectorNum: number, durMin: number, transSeg: number, faltSeg: number) {
    const totalSeg = Math.round(durMin * 60);

    if (sectorNum === 1) {
      this.riegoEnEjecucion1 = true;

      // Si el reloj no ha iniciado o si hay un desfase mayor a 3 segundos con el hardware, sincronizar base
      if (!this.timerInterval1 || Math.abs(this.timerSector1Seconds - faltSeg) > 3) {
        this.timerSector1Total = totalSeg;
        this.timerSector1Seconds = Math.max(0, faltSeg);
      }

      const updateAllTimerFormats1 = () => {
        // 1. Reloj principal verde y campo Faltante
        const mFalt = Math.floor(this.timerSector1Seconds / 60).toString().padStart(2, '0');
        const sFalt = (this.timerSector1Seconds % 60).toString().padStart(2, '0');
        const formattedFalt = `${mFalt}:${sFalt}`;
        
        this.timerSector1Formatted = formattedFalt;
        this.timerSector1FaltanteBDFormatted = formattedFalt;

        // 2. Campo Transcurrido (Total - Faltante)
        const elapsed = Math.max(0, this.timerSector1Total - this.timerSector1Seconds);
        const mTrans = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const sTrans = (elapsed % 60).toString().padStart(2, '0');
        this.tiempoTranscurrido1Formatted = `${mTrans}:${sTrans}`;
      };

      updateAllTimerFormats1();

      if (!this.timerInterval1) {
        this.timerInterval1 = setInterval(() => {
          if (this.timerSector1Seconds > 0) {
            this.timerSector1Seconds--;
            updateAllTimerFormats1();
          } else {
            this.detenerTimerLocal(1);
          }
        }, 1000);
      }
    } else {
      this.riegoEnEjecucion2 = true;

      if (!this.timerInterval2 || Math.abs(this.timerSector2Seconds - faltSeg) > 3) {
        this.timerSector2Total = totalSeg;
        this.timerSector2Seconds = Math.max(0, faltSeg);
      }

      const updateAllTimerFormats2 = () => {
        const mFalt = Math.floor(this.timerSector2Seconds / 60).toString().padStart(2, '0');
        const sFalt = (this.timerSector2Seconds % 60).toString().padStart(2, '0');
        const formattedFalt = `${mFalt}:${sFalt}`;

        this.timerSector2Formatted = formattedFalt;
        this.timerSector2FaltanteBDFormatted = formattedFalt;

        const elapsed = Math.max(0, this.timerSector2Total - this.timerSector2Seconds);
        const mTrans = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const sTrans = (elapsed % 60).toString().padStart(2, '0');
        this.tiempoTranscurrido2Formatted = `${mTrans}:${sTrans}`;
      };

      updateAllTimerFormats2();

      if (!this.timerInterval2) {
        this.timerInterval2 = setInterval(() => {
          if (this.timerSector2Seconds > 0) {
            this.timerSector2Seconds--;
            updateAllTimerFormats2();
          } else {
            this.detenerTimerLocal(2);
          }
        }, 1000);
      }
    }
  }

  iniciarTimer(sectorNum: number, minutos: number) {
    if (minutos <= 0) return;
    let totalSegundos = Math.round(minutos * 60);
    
    if (sectorNum === 1) {
      this.riegoEnEjecucion1 = true;
      this.timerSector1Total = totalSegundos;
      this.timerSector1Seconds = totalSegundos;
      if (this.timerInterval1) clearInterval(this.timerInterval1);
      
      this.timerInterval1 = setInterval(() => {
        if (this.timerSector1Seconds > 0) {
          this.timerSector1Seconds--;
          const transcurrido = this.timerSector1Total - this.timerSector1Seconds;

          const mFalt = Math.floor(this.timerSector1Seconds / 60).toString().padStart(2, '0');
          const sFalt = (this.timerSector1Seconds % 60).toString().padStart(2, '0');
          this.timerSector1Formatted = `${mFalt}:${sFalt}`;

          const mTrans = Math.floor(transcurrido / 60).toString().padStart(2, '0');
          const sTrans = (transcurrido % 60).toString().padStart(2, '0');
          this.tiempoTranscurrido1Formatted = `${mTrans}:${sTrans}`;
        } else {
          this.riegoEnEjecucion1 = false;
          clearInterval(this.timerInterval1);
        }
      }, 1000);
    } else {
      this.riegoEnEjecucion2 = true;
      this.timerSector2Total = totalSegundos;
      this.timerSector2Seconds = totalSegundos;
      if (this.timerInterval2) clearInterval(this.timerInterval2);
      
      this.timerInterval2 = setInterval(() => {
        if (this.timerSector2Seconds > 0) {
          this.timerSector2Seconds--;
          const transcurrido = this.timerSector2Total - this.timerSector2Seconds;

          const mFalt = Math.floor(this.timerSector2Seconds / 60).toString().padStart(2, '0');
          const sFalt = (this.timerSector2Seconds % 60).toString().padStart(2, '0');
          this.timerSector2Formatted = `${mFalt}:${sFalt}`;

          const mTrans = Math.floor(transcurrido / 60).toString().padStart(2, '0');
          const sTrans = (transcurrido % 60).toString().padStart(2, '0');
          this.tiempoTranscurrido2Formatted = `${mTrans}:${sTrans}`;
        } else {
          this.riegoEnEjecucion2 = false;
          clearInterval(this.timerInterval2);
        }
      }, 1000);
    }
  }

  ejecutarParoEmergencia(sectorNum: number) {
    const id = sectorNum === 1 ? '67bb6f2e85118d10af317f79' : '67bb79ac1c82e9d42d445882';
    this.http.post<any>(`${_URL_API}paroEmergencia/${id}`, {}).subscribe({
      next: (res) => {
        if (sectorNum === 1) {
          this.modoInteligenteSector1Activo = false;
          this.configuracion.modoRiego = 'Manual';
          this.configuracion.estado = false;
          this.riegoEnEjecucion1 = false;
          if (this.timerInterval1) clearInterval(this.timerInterval1);
          this.decisionSector1Text = 'Paro de emergencia ejecutado. Válvula desmarcada y riego detenido.';
        } else {
          this.modoInteligenteSector2Activo = false;
          this.configuracion2.modoRiego = 'Manual';
          this.configuracion2.estado = false;
          this.riegoEnEjecucion2 = false;
          if (this.timerInterval2) clearInterval(this.timerInterval2);
          this.decisionSector2Text = 'Paro de emergencia ejecutado. Válvula desmarcada y riego detenido.';
        }
      },
      error: (err) => console.error('Error en paro emergencia:', err)
    });
  }

  toggleEdicion(sectorNum: number) {
    if (sectorNum === 1) this.mostrandoEdicion1 = !this.mostrandoEdicion1;
    else this.mostrandoEdicion2 = !this.mostrandoEdicion2;
  }

  /* ========================================
     CARGAR CONFIGURACIONES
  ======================================== */

  cargarConfiguraciones() {
    const idSector1 = '67bb6f2e85118d10af317f79';
    const idSector2 = '67bb79ac1c82e9d42d445882';

    // Cargar Sector 1
    this.Sector.getSectorConfig(idSector1).subscribe({
      next: (res: any) => {
        if (res && res.Respuesta && res.Respuesta.length > 0) {
          const config = res.Respuesta[0];
          this.configuracion = {
            fechaInicio: config.fechaInicio || this.getLocalDate(),
            fechaFin: config.fechaFin || this.getLocalDate(),
            duracion: config.duracion || 0,
            dias: config.dias || [],
            horaInicio: config.horaInicio || this.getFormattedCurrentTime(),
            pausas: config.pausas || 0,
            duracionPausa: config.duracionPausa || 0,
            estado: config.estado !== undefined ? config.estado : false,
            pausasHis: config.pausas || 0,
            duracionPausaHis: config.duracionPausa || 0,
            modoRiego: config.modoRiego || 'Manual',
            cropType: config.cropType || 'Jitomate',
            cropGrowthStage: config.cropGrowthStage || 'Crecimiento',
            season: config.season || 'Lluvias',
            irrigationType: config.irrigationType || 'Goteo',
            soilType: config.soilType || 'Franco'
          };
          // Actualizar lecturas en tiempo real si existen en BD
          if (config.ultimasLecturas) {
            const humedadAnalog = config.ultimasLecturas.suelo ?? 2500;
            let pctHumedad = 35;
            if (humedadAnalog > 1023) {
              const val_norm = Math.max(0, Math.min(4095, humedadAnalog));
              pctHumedad = Math.round(((3200 - val_norm) * 100) / (3200 - 1400));
            } else {
              pctHumedad = Math.round(((1023 - humedadAnalog) * 100) / 1023);
            }
            const rVal1 = config.ultimasLecturas.lluvia ?? 4095;
            this.lecturasSector1 = {
              humedad: Math.max(0, Math.min(100, pctHumedad)),
              temperatura: Number((config.ultimasLecturas.temperatura ?? 25).toFixed(1)),
              humedadAire: Math.round(config.ultimasLecturas.humedadAire ?? config.ultimasLecturas.humedad ?? 50),
              lluvia: rVal1 <= 1023 ? rVal1 < 500 : rVal1 < 2000
            };
          }

          // Actualizar estado de los botones de días
          this.diasSector1.forEach(dia => {
            dia.selected = this.configuracion.dias.includes(dia.nombre);
          });
          // Sincronizar modo inteligente activo (sólo si modo es IA y estado activo en BD)
          this.modoInteligenteSector1Activo = this.configuracion.modoRiego === 'IA' && this.configuracion.estado === true;
          if (this.modoInteligenteSector1Activo) {
            this.modoConfiguracion = 'inteligente';
          }
          this.evaluarConIA(1);
        }
      },
      error: (err: any) => console.error('Error al cargar config Sector 1:', err)
    });

    // Cargar Sector 2
    this.Sector.getSectorConfig(idSector2).subscribe({
      next: (res: any) => {
        if (res && res.Respuesta && res.Respuesta.length > 0) {
          const config = res.Respuesta[0];
          this.configuracion2 = {
            fechaInicio: config.fechaInicio || this.getLocalDate(),
            fechaFin: config.fechaFin || this.getLocalDate(),
            duracion: config.duracion || 0,
            dias: config.dias || [],
            horaInicio: config.horaInicio || this.getFormattedCurrentTime(),
            pausas: config.pausas || 0,
            duracionPausa: config.duracionPausa || 0,
            estado: config.estado !== undefined ? config.estado : false,
            pausasHis: config.pausas || 0,
            duracionPausaHis: config.duracionPausa || 0,
            modoRiego: config.modoRiego || 'Manual',
            cropType: config.cropType || 'Jitomate',
            cropGrowthStage: config.cropGrowthStage || 'Crecimiento',
            season: config.season || 'Lluvias',
            irrigationType: config.irrigationType || 'Goteo',
            soilType: config.soilType || 'Franco'
          };

          // Actualizar lecturas en tiempo real si existen en BD
          if (config.ultimasLecturas) {
            const humedadAnalog = config.ultimasLecturas.suelo ?? 2500;
            let pctHumedad = 35;
            if (humedadAnalog > 1023) {
              const val_norm = Math.max(0, Math.min(4095, humedadAnalog));
              pctHumedad = Math.round(((3200 - val_norm) * 100) / (3200 - 1400));
            } else {
              pctHumedad = Math.round(((1023 - humedadAnalog) * 100) / 1023);
            }
            const rVal2 = config.ultimasLecturas.lluvia ?? 4095;
            this.lecturasSector2 = {
              humedad: Math.max(0, Math.min(100, pctHumedad)),
              temperatura: Number((config.ultimasLecturas.temperatura ?? 25).toFixed(1)),
              humedadAire: Math.round(config.ultimasLecturas.humedadAire ?? config.ultimasLecturas.humedad ?? 50),
              lluvia: rVal2 <= 1023 ? rVal2 < 500 : rVal2 < 2000
            };
          }
          // Actualizar estado de los botones de días
          this.diasSector2.forEach(dia => {
            dia.selected = this.configuracion2.dias.includes(dia.nombre);
          });
          // Sincronizar modo inteligente activo (sólo si modo es IA y estado activo en BD)
          this.modoInteligenteSector2Activo = this.configuracion2.modoRiego === 'IA' && this.configuracion2.estado === true;
          if (this.modoInteligenteSector2Activo) {
            this.modoConfiguracion = 'inteligente';
          }
          this.evaluarConIA(2);
        }
      },
      error: (err: any) => console.error('Error al cargar config Sector 2:', err)
    });
  }

  /* ========================================
     CAMBIAR MODO DE RIEGO Y TIPO DE SISTEMA
  ======================================== */

  onIrrigationTypeChange(sectorNum: number) {
    if (sectorNum === 1 && this.configuracion.irrigationType === 'Hidropónico') {
      this.configuracion.soilType = 'Sin Suelo';
    } else if (sectorNum === 2 && this.configuracion2.irrigationType === 'Hidropónico') {
      this.configuracion2.soilType = 'Sin Suelo';
    }
  }

  cambiarModo(modo: 'manual' | 'inteligente') {
    this.modoConfiguracion = modo;
  }

  /* ========================================
     ACTIVAR O DESACTIVAR MODELO
  ======================================== */

  activarModoInteligenteSector1() {
    this.modoConfiguracion = 'inteligente';
    this.modoInteligenteSector1Activo = true;
    this.configuracion.modoRiego = 'IA';
    this.configuracion.estado = true;
    this.evaluarConIA(1);
    
    // Guardar cambios inmediatamente en el servidor
    this.guardar('67bb6f2e85118d10af317f79');
  }

  activarModoInteligenteSector2() {
    this.modoConfiguracion = 'inteligente';
    this.modoInteligenteSector2Activo = true;
    this.configuracion2.modoRiego = 'IA';
    this.configuracion2.estado = true;
    this.evaluarConIA(2);

    // Guardar cambios inmediatamente en el servidor
    this.guardar2('67bb79ac1c82e9d42d445882');
  }

  detenerRiego(sectorNum: number) {
    this.ejecutarParoEmergencia(sectorNum);
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
      this.mostrarToast(this.translate.instant('TAB2.ERR_NO_ID'), 'error');
      return;
    }

    if (this.modoConfiguracion === 'manual') {
      this.configuracion.modoRiego = 'Manual';
      this.configuracion.estado = true;
      this.modoInteligenteSector1Activo = false;
    } else {
      this.configuracion.modoRiego = 'IA';
      this.configuracion.estado = true;
      this.modoInteligenteSector1Activo = true;
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
      duracionPausaHis: this.configuracion.duracionPausa,
      modoRiego: this.configuracion.modoRiego,
      cropType: this.configuracion.cropType,
      cropGrowthStage: this.configuracion.cropGrowthStage,
      season: this.configuracion.season,
      irrigationType: this.configuracion.irrigationType,
      soilType: this.configuracion.soilType
    };

    console.log(
      'Datos del Sector 1 a actualizar:',
      configuracionActualizada
    );

    this.Sector
      .putSector1(idSector, configuracionActualizada)
      .subscribe({
        next: (res: any) => {
          console.log('Sector 1 actualizado:', res);
          const msg = this.configuracion.modoRiego === 'IA'
            ? this.translate.instant('TAB2.SECTOR1_IA_UPDATED')
            : this.translate.instant('TAB2.SECTOR1_MANUAL_UPDATED');
          this.mostrarToast(msg, 'success');
          if (this.configuracion.modoRiego === 'IA') {
            this.evaluarConIA(1);
          }
        },
        error: (err: any) => {
          console.error('Error al actualizar el Sector 1:', err);
          this.mostrarToast(this.translate.instant('TAB2.ERR_UPDATE_SECTOR1'), 'error');
        }
      });
  }

  /* ========================================
     GUARDAR SECTOR 2
  ======================================== */

  guardar2(idSector: string) {
    if (!idSector) {
      this.mostrarToast(this.translate.instant('TAB2.ERR_NO_ID'), 'error');
      return;
    }

    if (this.modoConfiguracion === 'manual') {
      this.configuracion2.modoRiego = 'Manual';
      this.configuracion2.estado = true;
      this.modoInteligenteSector2Activo = false;
    } else {
      this.configuracion2.modoRiego = 'IA';
      this.configuracion2.estado = true;
      this.modoInteligenteSector2Activo = true;
    }

    const configuracionActualizada2 = {
      fechaInicio: this.configuracion2.fechaInicio,
      fechaFin: this.configuracion2.fechaFin,
      duracion: this.configuracion2.duracion,
      dias: this.configuracion2.dias,
      horaInicio: this.configuracion2.horaInicio,
      pausas: this.configuracion2.pausas,
      duracionPausa: this.configuracion2.duracionPausa,
      estado: this.configuracion2.estado,
      pausasHis: this.configuracion2.pausas,
      duracionPausaHis: this.configuracion2.duracionPausa,
      modoRiego: this.configuracion2.modoRiego,
      cropType: this.configuracion2.cropType,
      cropGrowthStage: this.configuracion2.cropGrowthStage,
      season: this.configuracion2.season,
      irrigationType: this.configuracion2.irrigationType,
      soilType: this.configuracion2.soilType
    };

    console.log(
      'Datos del Sector 2 a actualizar:',
      configuracionActualizada2
    );

    this.Sector
      .putSector1(idSector, configuracionActualizada2)
      .subscribe({
        next: (res: any) => {
          console.log('Sector 2 actualizado:', res);
          const msg = this.configuracion2.modoRiego === 'IA'
            ? this.translate.instant('TAB2.SECTOR2_IA_UPDATED')
            : this.translate.instant('TAB2.SECTOR2_MANUAL_UPDATED');
          this.mostrarToast(msg, 'success');
        },
        error: (err: any) => {
          console.error('Error al actualizar el Sector 2:', err);
          this.mostrarToast(this.translate.instant('TAB2.ERR_UPDATE_SECTOR2'), 'error');
        }
      });
  }

  /* ========================================
     CAMBIOS DE FECHA
  ======================================== */

  onFechaInicioChange(event: any) {
    this.configuracion.fechaInicio = this.formatDate(event.detail.value);
  }

  onFechaInicioChange2(event: any) {
    this.configuracion2.fechaInicio = this.formatDate(event.detail.value);
  }

  onFechaFinChange(event: any) {
    this.configuracion.fechaFin = this.formatDate(event.detail.value);
  }

  onFechaFinChange2(event: any) {
    this.configuracion2.fechaFin = this.formatDate(event.detail.value);
  }

  /* ========================================
     CAMBIOS DE HORA
  ======================================== */

  onHoraInicioChange(event: any) {
    this.configuracion.horaInicio = this.formatTime(event.detail.value);
  }

  onHoraInicioChange2(event: any) {
    this.configuracion2.horaInicio = this.formatTime(event.detail.value);
  }

  /* ========================================
     GUARDAR DÍAS SELECCIONADOS
  ======================================== */

  onDiasFinChangeSector1() {
    this.configuracion.dias = this.diasSector1
      .filter((dia) => dia.selected)
      .map((dia) => dia.nombre);
  }

  onDiasFinChangeSector2() {
    this.configuracion2.dias = this.diasSector2
      .filter((dia) => dia.selected)
      .map((dia) => dia.nombre);
  }

  /* ========================================
     FORMATEAR FECHA
  ======================================== */

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  /* ========================================
     FORMATEAR HORA
  ======================================== */

  formatTime(timeString: string): string {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? 'PM' : 'AM';
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
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${('0' + hours).slice(-2)}:${minutes} ${ampm}`;
  }

  /* ========================================
     MOSTRAR ALERTA
  ======================================== */

  mostrarAlerta(titulo: string, mensaje: string) {
    this.mostrarToast(mensaje, 'success');
  }

  /* ========================================
     OBTENER FECHA LOCAL
  ======================================== */

  getLocalDate(): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split('T')[0];
  }
}

/* ========================================
   INTERFAZ DE LOS DÍAS
======================================== */

interface Dia {
  nombre: string;
  selected: boolean;
}