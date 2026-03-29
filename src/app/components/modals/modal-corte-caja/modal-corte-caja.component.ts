import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService } from '../../../services/ventas.service';
import { AuthService } from '../../../services/auth.service';

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

  // Datos del día cargados del backend
  cantidadVentas: number = 0;
  montoInicial: number = 0;
  totalVentas: number = 0;
  efectivoEsperado: number = 0;  // montoInicial + totalVentas
  hayApertura: boolean = false;

  // Inputs del usuario
  efectivoContado: number | null = null;
  fondoSiguienteDia: number | null = null;
  observaciones: string = '';

  cargando: boolean = false;
  guardando: boolean = false;
  errorMsg: string = '';

  constructor(
    private ventasService: VentasService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.resetForm();
      this.cargarResumen();
    }
  }

  cargarResumen(): void {
    this.cargando = true;
    this.ventasService.getResumenCorte().subscribe({
      next: (resumen: any) => {
        this.cantidadVentas   = resumen.cantidad_ventas;
        this.totalVentas      = Number(resumen.total_ventas);
        this.montoInicial     = Number(resumen.monto_inicial);
        // efectivo_esperado ya viene calculado del backend
        this.efectivoEsperado = Number(resumen.efectivo_esperado ?? (this.montoInicial + this.totalVentas));
        this.hayApertura      = resumen.hay_apertura;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  // Diferencia: lo que contó el cajero vs lo que debería haber
get diferencia(): number {
  const contado = Number(this.efectivoContado ?? 0);
  const esperado = Number(this.efectivoEsperado ?? 0);
  return contado - esperado;
}

  // Valores numéricos seguros para mostrar
  get contado(): number {
  return Number(this.efectivoContado ?? 0);
}

get fondo(): number {
  return Math.min(
    Number(this.fondoSiguienteDia ?? 0),
    this.contado
  );
}

  // Cuánto se retira: lo contado menos el fondo
  get montoARetirar(): number {
  return Math.max(0, this.contado - this.fondo);
}

  get fechaHoy(): string {
    return new Date().toLocaleDateString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
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
    this.errorMsg = '';

    if (this.efectivoContado === null || this.efectivoContado < 0) {
      this.errorMsg = 'Ingresa el efectivo físico contado.';
      return;
    }
    if (this.fondoSiguienteDia === null || this.fondoSiguienteDia < 0) {
      this.errorMsg = 'Ingresa el fondo para el siguiente día.';
      return;
    }
    if (this.fondoSiguienteDia > this.efectivoContado) {
      this.errorMsg = 'El fondo no puede ser mayor al efectivo contado.';
      return;
    }

    this.guardando = true;
    this.ventasService.createCorte({
      id_empleado: this.authService.getIdEmpleado(),
      monto_final: this.efectivoContado,
      fondo_siguiente_dia: this.fondoSiguienteDia,
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
    this.efectivoContado   = null;
    this.fondoSiguienteDia = null;
    this.observaciones     = '';
    this.errorMsg          = '';
    this.cantidadVentas    = 0;
    this.montoInicial      = 0;
    this.totalVentas       = 0;
    this.efectivoEsperado  = 0;
    this.hayApertura       = false;
  }
}