import {
  Component,
  HostListener,
  inject
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonTitle,
  ViewDidEnter,
  ViewDidLeave,
  ViewWillEnter
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../components/language-selector/language-selector.component';
import { _URL_API } from '../config/config';

import {
  analyticsOutline,
  batteryHalfOutline,
  checkmarkCircleOutline,
  cubeOutline,
  flashOutline,
  gitBranchOutline,
  hardwareChipOutline,
  informationCircleOutline,
  leafOutline,
  partlySunnyOutline,
  pulseOutline,
  rainyOutline,
  speedometerOutline,
  thermometerOutline,
  timeOutline,
  warningOutline,
  waterOutline,
  wifiOutline
} from 'ionicons/icons';

declare const google: any;

type Sector = 'sector1' | 'sector2';
type ModoRiego = 'Manual' | 'Programado' | 'IA';
type TipoAlerta = 'success' | 'warning' | 'danger' | 'info';

interface DashboardData {
  humedadAmbiente: number;
  temperaturaAmbiente: number;

  humedadCaja: number;
  temperaturaCaja: number;

  humedadSuelo: number;
  lluvia: boolean;

  flujoActual: number;
  riegoActivo: boolean;

  voltaje: number;
  aguaHoy: number;
  precisionIA: number;

  bateria: number;
  generacion: number;

  estadoAmbiente: string;
  modeloIA: string;
}

interface HistorialRiego {
  fechaInicio: string;
  fechaFin: string;
  duracion: number;
  dias: string[];
  sector: string;
  estadoValvula: boolean;
  modo?: string;
  pausasRealizadas?: number;
  sector_id?: string;
  duracionPausa?: number;
}

interface AlertaDashboard {
  titulo: string;
  descripcion: string;
  tipo: TipoAlerta;
  icono: string;
  id?: string;
  mensaje?: string;
  tiempo?: string;
  sector?: Sector;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonTitle
  ]
})
export class Tab3Page
  implements ViewWillEnter, ViewDidEnter, ViewDidLeave {
  public http = inject(HttpClient);
  public router = inject(Router);
  public translate = inject(TranslateService);

  sectorSeleccionado: Sector = 'sector1';

  esp32Conectado = true;
  modoRiego: ModoRiego = 'Programado';

  ultimaActualizacion = new Date();

  valvulaSector1 = true;
  valvulaSector2 = false;

  alertas: AlertaDashboard[] = [];
  riegos: HistorialRiego[] = [];

  private googleChartsListo = false;

  private autoUpdateTimer:
    ReturnType<typeof setInterval> | null = null;

  private resizeTimer:
    ReturnType<typeof setTimeout> | null = null;

    private ciclosComunicacion = 0;

  private readonly sectorIds: Record<Sector, string> = {
    sector1: '67bb6f2e85118d10af317f79',
    sector2: '67bb79ac1c82e9d42d445882'
  };

  dashboardSector1: DashboardData = {
    humedadAmbiente: 0,
    temperaturaAmbiente: 0,

    humedadCaja: 0,
    temperaturaCaja: 0,

    humedadSuelo: 0,
    lluvia: false,

    flujoActual: 0,
    riegoActivo: false,

    voltaje: 12.1,
    aguaHoy: 0,
    precisionIA: 96.1,

    bateria: 84,
    generacion: 7.3,

    estadoAmbiente: 'Esperando lecturas de sensores',
    modeloIA: 'RandomForest-V2 (IA)'
  };

  dashboardSector2: DashboardData = {
    humedadAmbiente: 0,
    temperaturaAmbiente: 0,

    humedadCaja: 0,
    temperaturaCaja: 0,

    humedadSuelo: 0,
    lluvia: false,

    flujoActual: 0,
    riegoActivo: false,

    voltaje: 11.9,
    aguaHoy: 0,
    precisionIA: 96.1,

    bateria: 81,
    generacion: 6.9,

    estadoAmbiente: 'Esperando lecturas de sensores',
    modeloIA: 'RandomForest-V2 (IA)'
  };

  dashboard: DashboardData = this.dashboardSector1;

  ionViewWillEnter(): void {
    addIcons({
      analyticsOutline,
      batteryHalfOutline,
      checkmarkCircleOutline,
      cubeOutline,
      flashOutline,
      gitBranchOutline,
      hardwareChipOutline,
      informationCircleOutline,
      leafOutline,
      partlySunnyOutline,
      pulseOutline,
      rainyOutline,
      speedometerOutline,
      thermometerOutline,
      timeOutline,
      warningOutline,
      waterOutline,
      wifiOutline
    });

    this.actualizarDashboard();
    this.actualizarAlertas();
    this.iniciarActualizacionAutomatica();
  }

  ionViewDidEnter(): void {
    this.loadGoogleCharts();
    this.getHistorialRiego();
  }

  ionViewDidLeave(): void {
    if (this.autoUpdateTimer) {
      clearInterval(this.autoUpdateTimer);
    }

    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }

  onValveCardClick(sectorNum: number): void {
    const isActivo = sectorNum === 1 ? this.valvulaSector1 : this.valvulaSector2;

    if (isActivo) {
      // Si la bomba está ENCENDIDA: Desactivar inmediatamente con Paro de Emergencia en la BD y apagar relé
      const id = sectorNum === 1 ? '67bb6f2e85118d10af317f79' : '67bb79ac1c82e9d42d445882';
      this.http.post<any>(`${_URL_API}paroEmergencia/${id}`, {}).subscribe({
        next: (res) => {
          if (sectorNum === 1) {
            this.valvulaSector1 = false;
            this.dashboardSector1.riegoActivo = false;
          } else {
            this.valvulaSector2 = false;
            this.dashboardSector2.riegoActivo = false;
          }
          console.log(`[Tab3] Riego en sector ${sectorNum} desactivado correctamente.`);
          this.actualizarDashboard();
        },
        error: (err) => console.error('[Tab3 Error] Error al apagar bomba:', err)
      });
    } else {
      // Si la bomba está APAGADA: Redirigir al usuario al Tab de Configuración (/principal/tabs/tab2)
      this.router.navigateByUrl('/principal/tabs/tab2');
    }
  }

  /* =====================================
     DATOS CALCULADOS PARA LA VISTA
  ===================================== */

  get nombreSectorSeleccionado(): string {
    return this.sectorSeleccionado === 'sector1'
      ? 'Sector 01'
      : 'Sector 02';
  }

  get estadoHumedadSuelo(): string {
    if (this.dashboard.humedadSuelo < 30) {
      return 'Humedad baja';
    }

    if (this.dashboard.humedadSuelo > 75) {
      return 'Humedad alta';
    }

    return 'Humedad óptima';
  }

  /* =====================================
     CAMBIO DE SECTOR
  ===================================== */

  onSectorChange(event?: any): void {
    if (event && event.detail && event.detail.value) {
      this.sectorSeleccionado = event.detail.value as Sector;
    }
    this.actualizarDashboard();
    this.actualizarAlertas();

    setTimeout(() => {
      this.drawChart();
    }, 100);
  }

  actualizarDashboard(): void {
    this.dashboard =
      this.sectorSeleccionado === 'sector1'
        ? this.dashboardSector1
        : this.dashboardSector2;
  }

  /* =====================================
     ACTUALIZACIÓN AUTOMÁTICA
  ===================================== */

  private iniciarActualizacionAutomatica(): void {
    this.cargarTodosLosDatosReales();
    this.autoUpdateTimer = setInterval(() => {
      this.cargarTodosLosDatosReales();
    }, 5000);
  }

  private cargarTodosLosDatosReales(): void {
    const id1 = this.sectorIds.sector1;
    const id2 = this.sectorIds.sector2;

    this.http.get<any>(`${_URL_API}config1/${id1}`).subscribe({
      next: (res) => {
        if (res && res.Respuesta && res.Respuesta.length > 0) {
          const config = res.Respuesta[0];
          
          // Verificar si el ESP32 ha enviado lecturas en los últimos 2 minutos
          if (config.ultimasLecturas && config.ultimasLecturas.fecha) {
            const fechaUltima = new Date(config.ultimasLecturas.fecha.replace(' ', 'T')).getTime();
            const ahora = new Date().getTime();
            const diffMins = (ahora - fechaUltima) / (1000 * 60);
            this.esp32Conectado = diffMins <= 2.0;
          } else {
            this.esp32Conectado = false;
          }

          this.actualizarSectorConRespuesta(this.dashboardSector1, config);
        } else {
          this.esp32Conectado = false;
        }
        this.actualizarDashboard();
        this.actualizarAlertas();
      },
      error: (err) => {
        console.error('Error al obtener telemetría Sector 1:', err);
        this.esp32Conectado = false;
      }
    });

    this.http.get<any>(`${_URL_API}config1/${id2}`).subscribe({
      next: (res) => {
        if (res && res.Respuesta && res.Respuesta.length > 0) {
          this.actualizarSectorConRespuesta(this.dashboardSector2, res.Respuesta[0]);
        }
      },
      error: (err) => {
        console.error('Error al obtener telemetría Sector 2:', err);
      }
    });

    this.ultimaActualizacion = new Date();
  }

  private actualizarSectorConRespuesta(datos: DashboardData, config: any): void {
    if (config.ultimasLecturas) {
      datos.humedadAmbiente = Math.round(config.ultimasLecturas.humedadAire ?? config.ultimasLecturas.humedad ?? datos.humedadAmbiente);
      datos.temperaturaAmbiente = Number((config.ultimasLecturas.temperatura ?? datos.temperaturaAmbiente).toFixed(1));

      const humedadAnalog = config.ultimasLecturas.suelo ?? 2500;
      let pctHumedad = 35;
      if (humedadAnalog > 1023) {
        const val_norm = Math.max(0, Math.min(4095, humedadAnalog));
        pctHumedad = Math.round(((3200 - val_norm) * 100) / (3200 - 1400));
      } else {
        pctHumedad = Math.round(((1023 - humedadAnalog) * 100) / 1023);
      }
      datos.humedadSuelo = Math.max(0, Math.min(100, pctHumedad));
      datos.lluvia = (config.ultimasLecturas.lluvia ?? 4095) < 2500;
    }

    // Si el ESP32 está desconectado, forzar estados físicos inactivos (sin flujo y bomba apagada)
    if (!this.esp32Conectado) {
      datos.riegoActivo = false;
      datos.flujoActual = 0.0;
      this.valvulaSector1 = false;
      this.valvulaSector2 = false;
    } else {
      const hayLluvia = datos.lluvia;
      const minutosIa = config.recomendacionIA?.minutosCalculados ?? 0;
      const duracionActiva = Number(config.duracion) > 0 || (config.modoRiego === 'IA' && minutosIa > 0);
      datos.riegoActivo = Boolean(config.estadoValvula) || (config.estado && duracionActiva && !hayLluvia);
      
      const caudalLectura = config.ultimasLecturas?.caudal !== undefined ? Number(config.ultimasLecturas.caudal) : 0.0;
      datos.flujoActual = Number(caudalLectura.toFixed(1));
      
      this.valvulaSector1 = this.dashboardSector1.riegoActivo;
      this.valvulaSector2 = this.dashboardSector2.riegoActivo;
    }

    datos.modeloIA = config.modoRiego === 'IA' ? 'RandomForest-V2 (IA)' : 'Manual';

    // Generador eólico mantiene simulación por requerimiento
    this.simularDatosGenerador(datos);
  }

  private simularDatosGenerador(datos: DashboardData): void {
    datos.voltaje = this.limitarDecimal(datos.voltaje + this.variacion(0.04), 11.2, 13.2, 1);
    datos.generacion = this.limitarDecimal(datos.generacion + this.variacion(0.15), 0, 12, 1);
    datos.bateria = this.limitarRedondear(datos.bateria + this.variacion(0.3), 10, 100);
  }

  private variacion(maximo: number): number {
    return Math.random() * maximo * 2 - maximo;
  }

  private limitarRedondear(
    valor: number,
    minimo: number,
    maximo: number
  ): number {
    return Math.round(
      Math.max(minimo, Math.min(maximo, valor))
    );
  }

  private limitarDecimal(
    valor: number,
    minimo: number,
    maximo: number,
    decimales: number
  ): number {
    const valorLimitado =
      Math.max(minimo, Math.min(maximo, valor));

    return Number(valorLimitado.toFixed(decimales));
  }

  /* =====================================
     ALERTAS
  ===================================== */

  private actualizarAlertas(): void {
    const nuevasAlertas: AlertaDashboard[] = [];

    if (!this.esp32Conectado) {
      nuevasAlertas.push({
        titulo: 'ESP32 desconectado',
        descripcion: 'No se están recibiendo datos en tiempo real.',
        tipo: 'danger',
        icono: 'warning-outline'
      });
    }

    if (this.dashboard.bateria < 20) {
      nuevasAlertas.push({
        titulo: 'Batería del sistema baja',
        descripcion: `Nivel actual de batería: ${this.dashboard.bateria}%.`,
        tipo: 'warning',
        icono: 'warning-outline'
      });
    }

    if (this.dashboard.humedadSuelo < 30) {
      nuevasAlertas.push({
        titulo: 'Humedad del suelo crítica',
        descripcion: `Nivel actual: ${this.dashboard.humedadSuelo}%.`,
        tipo: 'warning',
        icono: 'information-circle-outline'
      });
    }

    if (this.dashboard.lluvia) {
      nuevasAlertas.push({
        titulo: 'Lluvia detectada en el sector',
        descripcion: 'El riego se ha pausado por seguridad.',
        tipo: 'info',
        icono: 'rainy-outline'
      });
    }

    this.alertas = nuevasAlertas.slice(0, 3);
  }

  /* =====================================
     HISTORIAL DE RIEGO
  ===================================== */

  getHistorialRiego(): void {
    this.http
      .get<any>(`${_URL_API}historial`)
      .subscribe({
        next: response => {
          if (
            response?.Respuesta &&
            Array.isArray(response.Respuesta)
          ) {
            this.riegos = response.Respuesta.map(
              (registro: any): HistorialRiego => ({
                fechaInicio:
                  registro.fechaInicio ||
                  'Fecha no disponible',

                fechaFin:
                  registro.fechaFin ||
                  'Fecha no disponible',

                duracion:
                  Number(registro.duracion) || 0,

                dias:
                  Array.isArray(registro.dias)
                    ? registro.dias
                    : [],

                sector:
                  this.obtenerSectorId(registro.sector_id),

                estadoValvula:
                  registro.estado !== undefined
                    ? Boolean(registro.estado)
                    : false
              })
            );

            // Calcular agua utilizada hoy a partir del historial real en BD
            const hoy = new Date();
            const yyyy = hoy.getFullYear();
            const mm = String(hoy.getMonth() + 1).padStart(2, '0');
            const dd = String(hoy.getDate()).padStart(2, '0');
            const hoyLocalStr = `${yyyy}-${mm}-${dd}`;

            const minutosHoy = this.riegos
              .filter(r => (r.fechaInicio === hoyLocalStr || r.fechaInicio.includes(hoyLocalStr)) && r.duracion > 0 && r.duracion <= 60)
              .reduce((sum, r) => sum + Number(r.duracion), 0);
            
            const litrosCalculados = Number((minutosHoy * 2.5).toFixed(1));
            this.dashboardSector1.aguaHoy = litrosCalculados;
            this.dashboardSector2.aguaHoy = litrosCalculados;
          }

          this.drawChart();
        },

        error: error => {
          console.error(
            'No se pudo cargar el historial. Se utilizarán datos simulados.',
            error
          );

          this.riegos = [];
          this.drawChart();
        }
      });
  }

  private obtenerSectorId(sector: any): string {
    if (typeof sector === 'string') {
      return sector;
    }

    return (
      sector?._id ||
      sector?.$oid ||
      sector?.id ||
      ''
    );
  }

  /* =====================================
     GOOGLE CHARTS
  ===================================== */

  private loadGoogleCharts(): void {
    if (
      typeof google === 'undefined' ||
      !google.charts
    ) {
      console.error(
        'Google Charts no está cargado en index.html.'
      );

      return;
    }

    google.charts.load('current', {
      packages: ['corechart']
    });

    google.charts.setOnLoadCallback(() => {
      this.googleChartsListo = true;
      this.drawChart();
    });
  }

  private drawChart(): void {
    if (!this.googleChartsListo) {
      return;
    }

    const container =
      document.getElementById('irrigation_chart');

    if (!container) {
      return;
    }

    const datosGrafica =
      new google.visualization.DataTable();

    datosGrafica.addColumn('string', 'Día');
    datosGrafica.addColumn(
      'number',
      'Duración (min)'
    );

    const filas = this.obtenerFilasGrafica();

    datosGrafica.addRows(filas);

    const opciones = {
      backgroundColor: 'transparent',

      colors: ['#59d7e7'],

      curveType: 'function',
      lineWidth: 3,
      pointSize: 7,
      areaOpacity: 0.12,

      legend: {
        position: 'none'
      },

      chartArea: {
        left: 70,
        right: 25,
        top: 25,
        bottom: 65,
        width: '86%',
        height: '72%'
      },

      hAxis: {
        title: 'Día',

        titleTextStyle: {
          color: '#8fb3e2',
          fontName: 'Plus Jakarta Sans',
          fontSize: 13,
          bold: true
        },

        textStyle: {
          color: '#d9e1f1',
          fontName: 'Plus Jakarta Sans',
          fontSize: 11
        },

        baselineColor: '#405376',

        gridlines: {
          color: 'transparent'
        }
      },

      vAxis: {
        title: 'Duración (min)',
        minValue: 0,

        viewWindow: {
          min: 0
        },

        titleTextStyle: {
          color: '#8fb3e2',
          fontName: 'Plus Jakarta Sans',
          fontSize: 13,
          bold: true
        },

        textStyle: {
          color: '#d9e1f1',
          fontName: 'Plus Jakarta Sans',
          fontSize: 11
        },

        baselineColor: '#405376',

        gridlines: {
          color: '#344765'
        },

        minorGridlines: {
          color: 'transparent'
        }
      },

      tooltip: {
        textStyle: {
          color: '#192338',
          fontName: 'Plus Jakarta Sans'
        }
      }
    };

    const grafica =
      new google.visualization.AreaChart(container);

    grafica.draw(datosGrafica, opciones);
  }

  private obtenerFilasGrafica(): Array<[string, number]> {
    const sectorId = this.sectorIds[this.sectorSeleccionado];

    const registrosSector = this.riegos.filter(
      riego => riego.sector === sectorId && Number(riego.duracion) > 0
    );

    // Agrupar duraciones acumuladas por cada fecha única (Día DD/MM)
    const agrupadoPorDia: Record<string, number> = {};

    registrosSector.forEach(riego => {
      const diaEtiqueta = this.formatearFecha(riego.fechaInicio);
      if (!agrupadoPorDia[diaEtiqueta]) {
        agrupadoPorDia[diaEtiqueta] = 0;
      }
      agrupadoPorDia[diaEtiqueta] += Number(riego.duracion) || 0;
    });

    const filas: Array<[string, number]> = Object.keys(agrupadoPorDia).map(dia => [
      dia,
      Number(agrupadoPorDia[dia].toFixed(1))
    ]);

    if (filas.length > 0) {
      return filas.slice(-7);
    }

    return this.crearHistorialSimulado();
  }

  private crearHistorialSimulado():
    Array<[string, number]> {

    const valoresSector1 =
      [18, 24, 20, 32, 27, 21, 29];

    const valoresSector2 =
      [12, 16, 14, 19, 15, 18, 13];

    const valores =
      this.sectorSeleccionado === 'sector1'
        ? valoresSector1
        : valoresSector2;

    return valores.map((duracion, index) => {
      const fecha = new Date();

      fecha.setDate(
        fecha.getDate() - (valores.length - 1 - index)
      );

      const etiqueta =
        `${fecha.getDate()
          .toString()
          .padStart(2, '0')}/` +
        `${(fecha.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

      return [etiqueta, duracion];
    });
  }

  private formatearFecha(fechaTexto: string): string {
    const fecha = new Date(fechaTexto);

    if (Number.isNaN(fecha.getTime())) {
      return fechaTexto;
    }

    return (
      `${fecha.getDate().toString().padStart(2, '0')}/` +
      `${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`
    );
  }

  /* =====================================
     REFRESH MANUAL
  ===================================== */

  handleRefresh(event: CustomEvent): void {
    this.cargarTodosLosDatosReales();
    this.actualizarDashboard();
    this.actualizarAlertas();
    this.getHistorialRiego();

    setTimeout(() => {
      (
        event.target as HTMLIonRefresherElement
      ).complete();
    }, 900);
  }

  /* =====================================
     REDIBUJAR AL CAMBIAR TAMAÑO
  ===================================== */

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = setTimeout(() => {
      this.drawChart();
    }, 250);
  }
}