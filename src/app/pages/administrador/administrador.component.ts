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
import { EstadisticasService } from '../../services/estadisticas.service';
import { AdminEstadoService } from '../../services/admin-estado.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-administrador',
  imports: [
    CommonModule,
    AsyncPipe,
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

  private graficasPendientes: boolean = false;
  private chartsCreados: boolean = false;
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
      const canvas = document.getElementById('chartVentasGanancias');
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
      this.graficasPendientes = true;
      return;
    }
    this.cargando = true;
    this.estadisticasService.getResumenCompleto().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
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
    if (this.chartsCreados) return;
    this.destroyCharts();
    const estadisticas = (this.adminEstado as any)['_estadisticas$'].value;
    if (!estadisticas) return;
    this.initChartVentasGanancias(estadisticas.ventas_por_mes);
    this.initChartVentasSemanales(estadisticas.ventas_semanales);
    this.initChartCategorias(estadisticas.ventas_por_categoria);
    this.chartsCreados = true;
  }

  private initChartVentasGanancias(data: any[]): void {
    const ctx = document.getElementById('chartVentasGanancias') as HTMLCanvasElement;
    if (!ctx) return;
    this.charts.push(new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.length ? data.map(v => v.nombre_mes) : ['Sin datos'],
        datasets: [
          {
            label: 'Ventas',
            data: data.map(v => Number(v.total_ventas)),
            borderColor: '#D962A3', backgroundColor: 'transparent',
            tension: 0, borderWidth: 2,
            pointBackgroundColor: '#D962A3', pointRadius: 4
          },
          {
            label: 'Ganancias',
            data: data.map(v => Number(v.total_ganancias)),
            borderColor: '#F2A0CD', backgroundColor: 'transparent',
            tension: 0, borderWidth: 2,
            pointBackgroundColor: '#F2A0CD', pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(200,200,200,0.3)' }, ticks: { color: '#888', font: { family: 'Inter', size: 10 } }, border: { color: '#333' } },
          y: { grid: { color: 'rgba(200,200,200,0.3)' }, ticks: { color: '#888', font: { family: 'Inter', size: 10 }, callback: (val) => Number(val).toLocaleString() }, border: { color: '#333' } }
        }
      }
    }));
  }

  private initChartVentasSemanales(data: any[]): void {
    const ctx = document.getElementById('chartVentasSemanales') as HTMLCanvasElement;
    if (!ctx) return;
    this.charts.push(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.length ? data.map(v => v.nombre_dia) : ['Sin datos'],
        datasets: [{
          label: 'Ventas',
          data: data.map(v => Number(v.total_ventas)),
          backgroundColor: '#D962A3', borderRadius: 4, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(200,200,200,0.3)' }, ticks: { color: '#888', font: { family: 'Inter', size: 10 } }, border: { color: '#333' } },
          y: { grid: { color: 'rgba(200,200,200,0.3)' }, ticks: { color: '#888', font: { family: 'Inter', size: 10 }, callback: (val) => Number(val).toLocaleString() }, border: { color: '#333' } }
        }
      }
    }));
  }

  private initChartCategorias(data: any[]): void {
    const ctx = document.getElementById('chartCategorias') as HTMLCanvasElement;
    if (!ctx) return;
    this.charts.push(new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.length ? data.map(v => v.categoria) : ['Sin datos'],
        datasets: [{
          data: data.length ? data.map(v => Number(v.total_ventas)) : [1],
          backgroundColor: ['#D962A3', '#F2A0CD', '#e87bbf', '#f5c0df', '#c9559a'],
          borderColor: '#ffffff', borderWidth: 3
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#888', font: { family: 'Inter', size: 10 }, padding: 12 } } }
      }
    }));
  }
}