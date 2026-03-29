import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService } from '../../../services/ventas.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-modal-apertura-caja',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-apertura-caja.component.html',
  styleUrl: './modal-apertura-caja.component.css'
})
export class ModalAperturaCajaComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Output() abierta = new EventEmitter<void>(); // emite cuando se registró la apertura

  montoApertura: string = '';
  montoSugerido: number = 0;
  guardando: boolean = false;
  cargando: boolean = false;
  errorMsg: string = '';

  constructor(
    private ventasService: VentasService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.cargarMontoSugerido();
    }
  }

  cargarMontoSugerido(): void {
    this.cargando = true;
    this.ventasService.getMontoSugerido().subscribe({
      next: (res) => {
        this.montoSugerido = res.monto_sugerido;
        this.montoApertura = this.montoSugerido > 0
          ? String(this.montoSugerido)
          : '';
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  usarSugerido(): void {
    this.montoApertura = String(this.montoSugerido);
  }

  get fechaHoy(): string {
    return new Date().toLocaleDateString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  registrar(): void {
    this.errorMsg = '';
    const monto = parseFloat(this.montoApertura);

    if (isNaN(monto) || monto < 0) {
      this.errorMsg = 'Ingresa un monto válido (puede ser $0.00).';
      return;
    }

    this.guardando = true;
    this.ventasService.createApertura({
      id_empleado: this.authService.getIdEmpleado(),
      monto_apertura: monto
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.montoApertura = '';
        this.abierta.emit();
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = err.error?.detail ?? 'Error al registrar apertura.';
      }
    });
  }
}