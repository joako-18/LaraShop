import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService } from '../../../services/ventas.service';

@Component({
  selector: 'app-modal-corte-caja',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-corte-caja.component.html',
  styleUrl: './modal-corte-caja.component.css'
})
export class ModalCorteCajaComponent implements OnChanges {

  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();
  @Output() finalizado = new EventEmitter<any>();

  cantidadVentas: number = 0;
  efectivoContado: string = '';
  observaciones: string = '';

  totalVentas: number = 0;
  montoInicial: number = 0;
  hayApertura: boolean = false;
  efectivoEsperado: number = 0;
  diferencia: number = 0;
  cargando: boolean = false;
  guardando: boolean = false;
  errorMsg: string = '';

  constructor(private ventasService: VentasService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.cargarResumenDia();
    }
  }

  get fechaHoy(): string {
    return new Date().toLocaleDateString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  cargarResumenDia(): void {
    this.cargando = true;
    this.ventasService.getResumenDelDia().subscribe({
      next: (res) => {
        this.cantidadVentas = res.cantidad_ventas;
        this.totalVentas = res.total_ventas;
        this.montoInicial = res.monto_inicial;
        this.hayApertura = res.hay_apertura;
        this.cargando = false;
        this.calcular();
      },
      error: () => { this.cargando = false; }
    });
  }

  calcular(): void {
    const contado = parseFloat(this.efectivoContado) || 0;
    this.efectivoEsperado = this.montoInicial + this.totalVentas;
    this.diferencia = contado - this.efectivoEsperado;
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar();
    }
  }

  cerrar(): void {
    this.resetForm();
    this.closed.emit();
  }

  finalizar(): void {
    if (!this.efectivoContado) {
      this.errorMsg = 'Ingresa el efectivo contado.';
      return;
    }

    const idEmpleado = 1;
    this.guardando = true;
    this.errorMsg = '';

    this.ventasService.createCorte({
      id_empleado: idEmpleado,
      monto_final: parseFloat(this.efectivoContado) || 0,
      observaciones: this.observaciones || undefined
    }).subscribe({
      next: (corte) => {
        this.guardando = false;
        this.finalizado.emit(corte);
        this.cerrar();
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = err.error?.detail ?? 'Error al guardar el corte.';
      }
    });
  }

  private resetForm(): void {
    this.efectivoContado = '';
    this.observaciones = '';
    this.errorMsg = '';
    this.diferencia = 0;
  }
}