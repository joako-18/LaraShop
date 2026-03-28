import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../services/productos.service';
import { ImagenesService } from '../../../services/imagenes.service';

@Component({
  selector: 'app-card-producto-inventario-imagen',
  imports: [CommonModule],
  templateUrl: './card-producto-inventario-imagen.component.html',
  styleUrl: './card-producto-inventario-imagen.component.css'
})
export class CardProductoInventarioImagenComponent {

  @Input() producto!: Producto;
  @Output() editar = new EventEmitter<Producto>();
  @Output() eliminar = new EventEmitter<number>();

  menuAbierto: boolean = false;

  constructor(private imagenesService: ImagenesService) {}

  toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }
  onEditar(): void { this.editar.emit(this.producto); this.menuAbierto = false; }
  onEliminar(): void { this.eliminar.emit(this.producto.id_producto); this.menuAbierto = false; }

  get imagenUrl(): string | null {
    return this.imagenesService.getUrlCompleta(this.producto.imagen ?? null);
  }

  getEstadoLabel(): string {
    if (this.producto.stock === 0) return 'Agotado';
    if (this.producto.stock <= this.producto.stock_minimo && this.producto.stock_minimo > 0) return 'Stock bajo';
    return 'En stock';
  }

  getEstadoClass(): string {
    switch (this.getEstadoLabel()) {
      case 'En stock':   return 'estado-en-stock';
      case 'Stock bajo': return 'estado-stock-bajo';
      case 'Agotado':    return 'estado-agotado';
      default: return '';
    }
  }

  get codigoBarras(): string {
    return this.producto.codigos_barras?.[0]?.codigo ?? '—';
  }
}