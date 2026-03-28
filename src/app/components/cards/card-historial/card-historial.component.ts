import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialAccionRead } from '../../../services/historial.service';

@Component({
  selector: 'app-card-historial',
  imports: [CommonModule],
  templateUrl: './card-historial.component.html',
  styleUrl: './card-historial.component.css'
})
export class CardHistorialComponent {
  @Input() item!: HistorialAccionRead;

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getIcono(nombre: string): string {
    if (nombre.includes('CREAR')) return '➕';
    if (nombre.includes('EDITAR')) return '✏️';
    if (nombre.includes('ELIMINAR')) return '🗑️';
    if (nombre.includes('VENTA') || nombre.includes('RECIBO')) return '🛒';
    if (nombre.includes('CORTE')) return '💰';
    if (nombre.includes('LOGIN') || nombre.includes('VER')) return '👁️';
    return '📋';
  }
}