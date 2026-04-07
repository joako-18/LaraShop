import { Component, OnInit, AfterViewChecked, OnDestroy, NgZone } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CardProveedorComponent } from '../../components/cards/card-proveedor/card-proveedor.component';
import { CardEmpleadoComponent } from '../../components/cards/card-empleado/card-empleado.component';
import { CardDescuentoComponent } from '../../components/cards/card-descuento/card-descuento.component';
import { CardCategoriaComponent } from '../../components/cards/card-categoria/card-categoria.component';
import { ModalNotificacionComponent } from '../../components/modals/modal-notificacion/modal-notificacion.component';
import { EstadisticasService, ResumenEstadisticas } from '../../services/estadisticas.service';
import { AdminEstadoService } from '../../services/admin-estado.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-administrador',
  imports: [
    CommonModule,
    NavbarComponent,
    CardProveedorComponent,
    CardEmpleadoComponent,
    CardDescuentoComponent,
    CardCategoriaComponent,
    ModalNotificacionComponent
  ],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})
export class AdministradorComponent implements OnInit, AfterViewChecked, OnDestroy {

  tabActiva: string = 'dashboard';
  notificacionesAbiertas: boolean = false;
  cargando: boolean = false;
  Number = Number;

  estadisticas: ResumenEstadisticas | null = null;

  private graficasPendientes = false;
  private chartsCreados = false;
  private charts: Chart[] = [];
  private destroy$ = new Subject<void>();

  readonly resumen$: Observable<any>;

  constructor(
    private ngZone: NgZone,
    private estadisticasService: EstadisticasService,
    private adminEstado: AdminEstadoService,
    private notificacionesService: NotificacionesService
  ) {
    this.resumen$ = this.adminEstado.resumen$;
  }

  ngOnInit(): void {
    this.notificacionesService.conectar();
    this.cargarEstadisticas();
  }

  ngAfterViewChecked(): void {
    if (this.graficasPendientes && this.tabActiva === 'dashboard') {
      const canvas = document.getElementById('chartSemanales');
      if (canvas) {
        this.graficasPendientes = false;
        this.ngZone.runOutsideAngular(() => setTimeout(() => this.initCharts(), 0));
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
    this.notificacionesService.desconectar();
  }

  cambiarTab(tab: string): void {
    this.tabActiva = tab;
    if (tab === 'dashboard') {
      this.chartsCreados = false;
      this.graficasPendientes = true;
    }
  }

  cargarEstadisticas(): void {
    if (this.adminEstado.estadisticasCargadas()) {
      this.estadisticas = (this.adminEstado as any)['_estadisticas$'].value;
      this.graficasPendientes = true;
      return;
    }
    this.cargando = true;
    this.estadisticasService.getResumenCompleto().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.adminEstado.setEstadisticas(data);
        this.cargando = false;
        this.graficasPendientes = true;
      },
      error: () => { this.cargando = false; }
    });
  }

  abrirNotificaciones(): void { this.notificacionesAbiertas = true; }

  private destroyCharts(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
    this.chartsCreados = false;
  }

  private initCharts(): void {
    if (this.chartsCreados || !this.estadisticas) return;
    this.destroyCharts();
    this.initChartSemanales(this.estadisticas.ventas_semanales);
    this.initChartProductos(this.estadisticas.productos_mas_vendidos);
    this.chartsCreados = true;
  }

  private initChartSemanales(data: any[]): void {
    const ctx = document.getElementById('chartSemanales') as HTMLCanvasElement;
    if (!ctx) return;
    this.charts.push(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.length ? data.map(v => v.nombre_dia) : ['Sin datos'],
        datasets: [{
          label: 'Ventas',
          data: data.map(v => Number(v.total_ventas)),
          backgroundColor: '#D962A3',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: 'rgba(200,200,200,0.25)', lineWidth: 1 },
            ticks: { color: '#999', font: { family: 'Inter', size: 10 } },
            border: { color: '#ddd' }
          },
          y: {
            grid: { color: 'rgba(200,200,200,0.25)', lineWidth: 1 },
            ticks: {
              color: '#999',
              font: { family: 'Inter', size: 10 },
              callback: (val) => `${Number(val).toLocaleString()}`
            },
            border: { color: '#ddd' }
          }
        }
      }
    }));
  }

  private initChartProductos(data: any[]): void {
    const ctx = document.getElementById('chartProductos') as HTMLCanvasElement;
    if (!ctx) return;
    const colores = ['#D962A3', '#F2A0CD', '#e87bbf', '#f5c0df', '#c9559a', '#f0b8d8'];
    this.charts.push(new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.length ? data.map(v => v.nombre) : ['Sin datos'],
        datasets: [{
          data: data.length ? data.map(v => v.cantidad_vendida) : [1],
          backgroundColor: colores,
          borderColor: '#ffffff',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    }));
  }

  getLeyendaColor(index: number): string {
  const colores = ['#D962A3', '#F2A0CD', '#e87bbf', '#f5c0df', '#c9559a', '#f0b8d8'];
  return colores[index % colores.length];
}
}