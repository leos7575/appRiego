import { Component, AfterViewInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { UsuariosService } from '../services/usuarios.service';

declare var google: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent ],
})
export class Tab3Page implements AfterViewInit {
  // Esta variable almacenará los datos obtenidos de la API
  riegos: { fechaInicio: string; fechaFin: string; duracion: number; dias: string[]; sector: string; estadoValvula: boolean; }[] = [];

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}
  ngOnInit() {
    
  }
  ngAfterViewInit() {
    this.loadGoogleCharts();
    this.getHistorialRiego(); // Llamada a la API para obtener los datos de riego
  }

  // Función para obtener los datos de la API
  getHistorialRiego() {
    this.usuariosService.getHistorialRiego().subscribe(
      (response) => {
        if (response.Respuesta && Array.isArray(response.Respuesta)) {
          // Mapeo seguro de los registros
          this.riegos = response.Respuesta.map((registro: any) => ({
            fechaInicio: registro.fechaInicio || 'Fecha no disponible',  // Usar un valor predeterminado si no está disponible
            fechaFin: registro.fechaFin || 'Fecha no disponible',        // Lo mismo para fechaFin
            duracion: registro.duracion || 0,                            // Valor por defecto en caso de que no exista
            dias: registro.dias || [],                                   // Lista de días
            sector: registro.sector_id || 'Sector no disponible',        // Comprobación para sector_id
            estadoValvula: registro.estado !== undefined ? registro.estado : false,  // Comprobación de estado
          }));
          this.drawCharts(); // Redibujar las gráficas después de obtener los datos
        } else {
          console.error('No se encontraron datos en la respuesta');
        }
      },
      (error) => {
        console.error('Error al obtener los datos de riego:', error);
      }
    );
  }

  loadGoogleCharts() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {
    const sector1Data = new google.visualization.DataTable();
    const sector2Data = new google.visualization.DataTable();
    
    // Agregar columnas a los DataTables
    sector1Data.addColumn('string', 'Día');
    sector1Data.addColumn('number', 'Duración (min)');
    sector1Data.addColumn({ type: 'string', role: 'style' });
    
    sector2Data.addColumn('string', 'Día');
    sector2Data.addColumn('number', 'Duración (min)');
    sector2Data.addColumn({ type: 'string', role: 'style' });
    
    // Filtrar los datos por sector
    const sector1Riegos = this.riegos.filter(riego => riego.sector === '67bb6f2e85118d10af317f79');
    const sector2Riegos = this.riegos.filter(riego => riego.sector === '67bb79ac1c82e9d42d445882');

    // Función para llenar los datos en las gráficas
    const addRowsToChart = (riegoArray: any[], dataTable: any) => {
      riegoArray.forEach((riego) => {
        const color = riego.estadoValvula ? '#74E59C' : '#E57474'; // Verde si estaba activa, rojo si estaba apagada
        riego.dias.forEach((dia: string) => {
          dataTable.addRow([dia, riego.duracion, `color: ${color}`]);
        });
      });
    };

    // Añadir los datos de cada sector a sus respectivas gráficas
    addRowsToChart(sector1Riegos, sector1Data);
    addRowsToChart(sector2Riegos, sector2Data);

    // Opciones de la gráfica para el sector 1
    const sector1Options = {
      title: 'Duración de Riego - Sector 1',
      hAxis: { title: 'Día' },
      vAxis: { title: 'Duración (min)', minValue: 0 },
      legend: 'none',
    };

    // Opciones de la gráfica para el sector 2
    const sector2Options = {
      title: 'Duración de Riego - Sector 2',
      hAxis: { title: 'Día' },
      vAxis: { title: 'Duración (min)', minValue: 0 },
      legend: 'none',
    };

    // Dibujar las gráficas
    const sector1Chart = new google.visualization.ScatterChart(document.getElementById('sector1_chart'));
    const sector2Chart = new google.visualization.ScatterChart(document.getElementById('sector2_chart'));
    sector1Chart.draw(sector1Data, sector1Options);
    sector2Chart.draw(sector2Data, sector2Options);
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getHistorialRiego();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
}
