import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCarrito } from '../../../services/carrito-estado.service';

@Component({
  selector: 'app-card-product-venta',
  imports: [CommonModule, FormsModule],
  templateUrl: './card-product-venta.component.html',
  styleUrl: './card-product-venta.component.css'
})
export class CardProductVentaComponent {
  @Input() item!: ItemCarrito;
  @Output() cantidadChange = new EventEmitter<{ id_producto: number; cantidad: number }>();
  @Output() eliminar = new EventEmitter<number>();

  incrementar(): void {
    if (this.item.cantidad < this.item.producto.stock) {
      this.cantidadChange.emit({
        id_producto: this.item.producto.id_producto,
        cantidad: this.item.cantidad + 1
      });
    }
  }

  decrementar(): void {
    if (this.item.cantidad > 1) {
      this.cantidadChange.emit({
        id_producto: this.item.producto.id_producto,
        cantidad: this.item.cantidad - 1
      });
    }
  }

  onCantidadInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = parseInt(input.value) || 1;
    const cantidad = Math.min(Math.max(1, valor), this.item.producto.stock);
    this.cantidadChange.emit({
      id_producto: this.item.producto.id_producto,
      cantidad
    });
  }

  onEliminar(): void {
    this.eliminar.emit(this.item.producto.id_producto);
  }

  get codigoBarras(): string {
    return this.item.producto.codigos_barras?.[0]?.codigo ?? '—';
  }

  get subtotal(): number {
    return Number(this.item.producto.precio) * this.item.cantidad;
  }

  get stockMaximo(): number {
    return this.item.producto.stock;
  }
}