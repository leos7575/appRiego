import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  IonTitle
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

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
}

interface AlertaDashboard {
  titulo: string;
  descripcion: string;
  tipo: TipoAlerta;
  icono: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  implements OnInit, AfterViewInit, OnDestroy {

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
    humedadAmbiente: 45,
    temperaturaAmbiente: 28,

    humedadCaja: 38,
    temperaturaCaja: 32.6,

    humedadSuelo: 35,
    lluvia: false,

    flujoActual: 3.2,
    riegoActivo: true,

    voltaje: 12.1,
    aguaHoy: 13.5,
    precisionIA: 92,

    bateria: 84,
    generacion: 7.3,

    estadoAmbiente: 'Condiciones óptimas',
    modeloIA: 'Regresión'
  };

  dashboardSector2: DashboardData = {
    humedadAmbiente: 53,
    temperaturaAmbiente: 26,

    humedadCaja: 40,
    temperaturaCaja: 30.4,

    humedadSuelo: 49,
    lluvia: false,

    flujoActual: 0,
    riegoActivo: false,

    voltaje: 11.9,
    aguaHoy: 12.7,
    precisionIA: 89,

    bateria: 81,
    generacion: 6.9,

    estadoAmbiente: 'Condiciones óptimas',
    modeloIA: 'Regresión'
  };

  dashboard: DashboardData = this.dashboardSector1;

  constructor(private http: HttpClient) {
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
  }

  ngOnInit(): void {
    this.actualizarDashboard();
    this.actualizarAlertas();
    this.iniciarActualizacionAutomatica();
  }

  ngAfterViewInit(): void {
    this.loadGoogleCharts();
    this.getHistorialRiego();
  }

  ngOnDestroy(): void {
    if (this.autoUpdateTimer) {
      clearInterval(this.autoUpdateTimer);
    }

    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
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

  onSectorChange(): void {
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
  this.autoUpdateTimer = setInterval(() => {
    this.simularEstadoComunicacion();

    if (this.esp32Conectado) {
      this.simularTodosLosDatos();
    }

    this.actualizarAlertas();
  }, 5000);
}

//Este metodo debe obtener DATOS REALES DE LA API 
private simularEstadoComunicacion(): void { 
  this.ciclosComunicacion++;

  // Cada seis actualizaciones se simula una falla.
  // Como cada actualización tarda cinco segundos,
  // la falla aparecerá aproximadamente cada 30 segundos.
  this.esp32Conectado =
    this.ciclosComunicacion % 6 !== 0;
}

  private simularTodosLosDatos(): void {
    this.simularDatosSector(this.dashboardSector1);
    this.simularDatosSector(this.dashboardSector2);

    this.ultimaActualizacion = new Date();
  }

  private simularDatosSector(datos: DashboardData): void {
    datos.humedadAmbiente = this.limitarRedondear(
      datos.humedadAmbiente + this.variacion(2),
      25,
      85
    );

    datos.temperaturaAmbiente = this.limitarDecimal(
      datos.temperaturaAmbiente + this.variacion(0.5),
      15,
      42,
      1
    );

    datos.humedadCaja = this.limitarRedondear(
      datos.humedadCaja + this.variacion(1),
      15,
      80
    );

    datos.temperaturaCaja = this.limitarDecimal(
      datos.temperaturaCaja + this.variacion(0.4),
      18,
      50,
      1
    );

    datos.humedadSuelo = this.limitarRedondear(
      datos.humedadSuelo + this.variacion(1),
      10,
      95
    );

    datos.voltaje = this.limitarDecimal(
      datos.voltaje + this.variacion(0.04),
      11.2,
      13.2,
      1
    );

    datos.generacion = this.limitarDecimal(
      datos.generacion + this.variacion(0.15),
      0,
      12,
      1
    );

    datos.precisionIA = this.limitarRedondear(
      datos.precisionIA + this.variacion(0.5),
      80,
      99
    );

    datos.bateria = this.limitarRedondear(
      datos.bateria + this.variacion(0.3),
      10,
      100
    );

    if (datos.riegoActivo && !datos.lluvia) {
      datos.flujoActual = this.limitarDecimal(
        datos.flujoActual + this.variacion(0.15),
        1.5,
        6,
        1
      );

      const litrosEnCincoSegundos =
        (datos.flujoActual / 60) * 5;

      datos.aguaHoy = Number(
        (datos.aguaHoy + litrosEnCincoSegundos).toFixed(1)
      );
    } else {
      datos.flujoActual = 0;
    }
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
        descripcion: 'No se están recibiendo datos del dispositivo.',
        tipo: 'danger',
        icono: 'warning-outline'
      });
    }

    if (this.dashboard.bateria < 30) {
      nuevasAlertas.push({
        titulo: 'Batería baja',
        descripcion: `La batería se encuentra al ${this.dashboard.bateria}%.`,
        tipo: 'warning',
        icono: 'warning-outline'
      });
    }

    if (this.dashboard.humedadSuelo < 30) {
      nuevasAlertas.push({
        titulo: 'Humedad del suelo baja',
        descripcion: `${this.nombreSectorSeleccionado} necesita riego.`,
        tipo: 'warning',
        icono: 'information-circle-outline'
      });
    }

    if (this.dashboard.lluvia) {
      nuevasAlertas.push({
        titulo: 'Lluvia detectada',
        descripcion: 'El riego debe mantenerse detenido.',
        tipo: 'info',
        icono: 'rainy-outline'
      });
    }

    if (this.dashboard.temperaturaCaja >= 38) {
      nuevasAlertas.push({
        titulo: 'Temperatura elevada en la caja',
        descripcion: 'Revise la ventilación de la caja electrónica.',
        tipo: 'warning',
        icono: 'warning-outline'
      });
    }

    if (nuevasAlertas.length === 0) {
      nuevasAlertas.push({
        titulo: 'Sistema funcionando correctamente',
        descripcion: 'No se detectaron errores ni alertas.',
        tipo: 'success',
        icono: 'checkmark-circle-outline'
      });

      nuevasAlertas.push({
        titulo: 'Comunicación estable',
        descripcion: 'Los datos del ESP32 se reciben correctamente.',
        tipo: 'info',
        icono: 'wifi-outline'
      });
    }

    this.alertas = nuevasAlertas.slice(0, 3);
  }

  /* =====================================
     HISTORIAL DE RIEGO
  ===================================== */

  getHistorialRiego(): void {
    this.http
      .get<any>('https://apiriego.onrender.com/historial')
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

  private obtenerFilasGrafica():
    Array<[string, number]> {

    const sectorId =
      this.sectorIds[this.sectorSeleccionado];

    const registrosSector = this.riegos.filter(
      riego => riego.sector === sectorId
    );

    const filas: Array<[string, number]> = [];

    registrosSector.forEach(riego => {
      const etiquetas =
        riego.dias.length > 0
          ? riego.dias
          : [this.formatearFecha(riego.fechaInicio)];

      etiquetas.forEach(dia => {
        filas.push([
          dia,
          Number(riego.duracion) || 0
        ]);
      });
    });

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
    this.simularTodosLosDatos();
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