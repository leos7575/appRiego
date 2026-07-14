import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';

import { HttpClient } from '@angular/common/http';

declare var google: any;
/*=====================================
=            DASHBOARD DATA           =
=====================================*/
interface DashboardData{
  humedad:number;
  temperatura:number;
  voltaje:number;
  aguaHoy:number;
  precisionIA:number;
  estadoValvula:boolean;
  bateria:number;
  generacion:number;
  estadoAmbiente:string;
  modeloIA:string;
}

/*=====================================
=            COMPONENTE              =
=====================================*/
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonGrid,
    IonRow,
    IonCol,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    CommonModule,
    FormsModule,
    IonIcon
  ],
})

export class Tab3Page implements AfterViewInit {

  /*=====================================
  =            DASHBOARD               =
  =====================================*/

  sectorSeleccionado:string='sector1';
  dashboard!:DashboardData;
  dashboardSector1:DashboardData={
    humedad:45,
    temperatura:28,
    voltaje:12.1,
    aguaHoy:13.5,
    precisionIA:92,
    estadoValvula:true,
    bateria:84,
    generacion:7.3,
    estadoAmbiente:'Óptimo',
    modeloIA:'Regresión'
  };

  dashboardSector2:DashboardData={
    humedad:53,
    temperatura:26,
    voltaje:11.9,
    aguaHoy:12.7,
    precisionIA:89,
    estadoValvula:false,
    bateria:81,
    generacion:6.9,
    estadoAmbiente:'Óptimo',
    modeloIA:'Regresión'
  };

  /*=====================================
  =          HISTORIAL RIEGO          =
  =====================================*/

  riegos:{
    fechaInicio:string;
    fechaFin:string;
    duracion:number;
    dias:string[];
    sector:string;
    estadoValvula:boolean;
  }[]=[];

  constructor(private http:HttpClient){}
  ngOnInit(){
    this.actualizarDashboard();
  }

  ngAfterViewInit(){
    this.loadGoogleCharts();
    this.getHistorialRiego();
  }

  /*=====================================
  =      ACTUALIZAR DASHBOARD         =
  =====================================*/

  actualizarDashboard(){
    this.dashboard=
      this.sectorSeleccionado==='sector1'
      ? this.dashboardSector1
      : this.dashboardSector2;
  }

  /*=====================================
  =        SIMULADOR DE SENSORES      =
  =====================================*/

  simularDatos(){
    const datos=this.dashboard;
    datos.humedad=
      Math.round(
      Math.max(
      35,
      Math.min(
      70,
      datos.humedad+(Math.random()*4-2)
      )));

    datos.temperatura=
      Math.round(
      Math.max(
      20,
      Math.min(
      35,
      datos.temperatura+(Math.random()*2-1)
      )));

    datos.voltaje=
      Number(
      (
      Math.max(
      11.5,
      Math.min(
      12.6,
      datos.voltaje+(Math.random()*0.1-0.05)
      ))
      ).toFixed(1));

    datos.aguaHoy=
      Number(
      (
      datos.aguaHoy+
      Math.random()*0.2
      ).toFixed(1));

    datos.precisionIA=
      Math.round(
      Math.max(
      85,
      Math.min(
      98,
      datos.precisionIA+
      (Math.random()*2-1)
      )));

    datos.bateria=
      Math.round(
      Math.max(
      70,
      Math.min(
      100,
      datos.bateria+
      (Math.random()*2-1)
      )));

    datos.generacion=
      Number(
      (
      Math.max(
      5,
      Math.min(
      9,
      datos.generacion+
      (Math.random()*0.3-0.15)
      ))
      ).toFixed(1));

  }

  /*=====================================
  =      PETICION HISTORIAL           =
  =====================================*/

  getHistorialRiego(){
    this.http.get<any>('https://apiriego.onrender.com/historial').subscribe(
      (response)=>{
        if(response.Respuesta && Array.isArray(response.Respuesta)){
          this.riegos=response.Respuesta.map((registro:any)=>({
            fechaInicio:registro.fechaInicio || 'Fecha no disponible',
            fechaFin:registro.fechaFin || 'Fecha no disponible',
            duracion:registro.duracion || 0,
            dias:registro.dias || [],
            sector:registro.sector_id || 'Sector no disponible',
            estadoValvula:
            registro.estado!==undefined
            ? registro.estado
            : false,
          }));
          this.drawCharts();
        }else{
          console.error('No se encontraron datos');
        }
      },
      error=>{
        console.error(error);
      }
    );
  }

  /*=====================================
  =        GOOGLE CHARTS             =
  =====================================*/

  loadGoogleCharts(){
    google.charts.load('current',{
      packages:['corechart']
    });
    google.charts.setOnLoadCallback(
      this.drawCharts.bind(this)
    );
  }

    drawCharts() {
    // Si los contenedores no están en el DOM evitamos errores
    const s1Container = document.getElementById('sector1_chart');
    const s2Container = document.getElementById('sector2_chart');

    const sector1Data = new google.visualization.DataTable();
    sector1Data.addColumn('string', 'Día');
    sector1Data.addColumn('number', 'Duración (min)');
    sector1Data.addColumn({ type: 'string', role: 'style' });

    const sector2Data = new google.visualization.DataTable();
    sector2Data.addColumn('string', 'Día');
    sector2Data.addColumn('number', 'Duración (min)');
    sector2Data.addColumn({ type: 'string', role: 'style' });

    const sector1Riegos = this.riegos.filter(
      riego => riego.sector === '67bb6f2e85118d10af317f79'
    );

    const sector2Riegos = this.riegos.filter(
      riego => riego.sector === '67bb79ac1c82e9d42d445882'
    );

    const addRowsToChart = (riegoArray: any[], dataTable: any) => {

      riegoArray.forEach((riego) => {

        const color = riego.estadoValvula
          ? '#8FB3E2'
          : '#31487A';

        riego.dias.forEach((dia: string) => {

          dataTable.addRow([
            dia,
            riego.duracion,
          `point { size: 7; fill-color: ${color}; }`
          ]);
        });
      });
    };

    addRowsToChart(sector1Riegos, sector1Data);
    addRowsToChart(sector2Riegos, sector2Data);
    const baseOptions = {
      backgroundColor: '#1E2E4F',
      legend: 'none',
      titleTextStyle: {
        color: '#ffffff',
        fontName: 'Plus Jakarta Sans',
        fontSize: 16,
        bold: true
      },

      hAxis: {
        title: 'Día',
        titleTextStyle: {
          color: '#8FB3E2',
          fontName: 'Plus Jakarta Sans',
          bold: true
        },
        textStyle: {
          color: '#D9E1F1'
        },
        gridlines: {
          color: 'rgba(143,179,226,0.1)'
        }
      },
      vAxis: {
        title: 'Duración (min)',
        minValue: 0,
        titleTextStyle: {
          color: '#8FB3E2',
          fontName: 'Plus Jakarta Sans',
          bold: true
        },
        textStyle: {
          color: '#D9E1F1'
        },
        gridlines: {
          color: 'rgba(143,179,226,0.1)'
        }
      }
    };

    if (s1Container) {
      const sector1Chart = new google.visualization.ScatterChart(s1Container);
      sector1Chart.draw(
        sector1Data,
        {
          ...baseOptions,
          title: 'Historial de Duración - Sector 1'
        }
      );
    }

    if (s2Container) {
      const sector2Chart = new google.visualization.ScatterChart(s2Container);
      sector2Chart.draw(
        sector2Data,
        {
          ...baseOptions,
          title: 'Historial de Duración - Sector 2'
        }
      );
    }
  }

  /*=====================================
  =      CAMBIO DE SECTOR
  =====================================*/
  onSectorChange() {
    this.actualizarDashboard();
    this.simularDatos();
    requestAnimationFrame(() => {
      this.drawCharts();
    });
  }
  /*=====================================
  =      REFRESH
  =====================================*/
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.getHistorialRiego();
      this.actualizarDashboard();
      this.simularDatos();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
}
