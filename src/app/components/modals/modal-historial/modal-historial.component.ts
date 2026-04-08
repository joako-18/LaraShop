import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardHistorialComponent } from '../../cards/card-historial/card-historial.component';
import { EmpleadoRead } from '../../../models';
import { HistorialService } from '../../../services/historial.service';
import { HistorialAccionRead } from '../../../models';

export interface EmpleadoDetalle extends EmpleadoRead {
  fechaIngreso: string;
}

@Component({
  selector: 'app-modal-historial',
  imports: [CommonModule, CardHistorialComponent],
  templateUrl: './modal-historial.component.html',
  styleUrl: './modal-historial.component.css'
})
export class ModalHistorialComponent implements OnChanges {

  @Input() isOpen: boolean = false;
  @Input() empleado: EmpleadoDetalle | null = null;
  @Output() closed = new EventEmitter<void>();

  historial: HistorialAccionRead[] = [];
  cargando: boolean = false;

  constructor(private historialService: HistorialService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true && this.empleado) {
      this.cargarHistorial();
    }
    if (changes['empleado']?.currentValue && this.isOpen) {
      this.cargarHistorial();
    }
  }

  cargarHistorial(): void {
    if (!this.empleado) return;
    this.cargando = true;
    this.historialService.getHistorialEmpleado(this.empleado.id_empleado).subscribe({
      next: (historial) => { this.historial = historial; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closed.emit();
    }
  }
}