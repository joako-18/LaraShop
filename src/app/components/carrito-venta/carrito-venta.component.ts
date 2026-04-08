import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CardProductVentaComponent } from '../cards/card-product-venta/card-product-venta.component';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CarritoEstadoService } from '../../services/carrito-estado.service';
import { ItemCarrito } from '../../models';

export type { ItemCarrito };

@Component({
  selector: 'app-carrito-venta',
  imports: [CommonModule, FormsModule, CardProductVentaComponent],
  templateUrl: './carrito-venta.component.html',
  styleUrl: './carrito-venta.component.css'
})
export class CarritoVentaComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchTerm: string = '';
  buscando: boolean = false;
  errorMsg: string = '';
  noEncontrado: boolean = false;

  carrito: ItemCarrito[] = [];
  ventaExitosa: boolean = false;

  carrito$!: Observable<ItemCarrito[]>;
  ventaExitosa$!: Observable<boolean>;

  private subs = new Subscription();

  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private carritoEstado: CarritoEstadoService
  ) {
    this.carrito$ = this.carritoEstado.carrito$;
    this.ventaExitosa$ = this.carritoEstado.ventaExitosa$;
  }

  ngOnInit(): void {
    this.subs.add(
      this.carritoEstado.carrito$.subscribe(items => { this.carrito = items; })
    );
    this.subs.add(
      this.carritoEstado.ventaExitosa$.subscribe(v => { this.ventaExitosa = v; })
    );
  }

  ngAfterViewInit(): void { this.enfocarInput(); }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  enfocarInput(): void {
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 80);
  }

  onBlur(): void {
    setTimeout(() => {
      const activo = document.activeElement;
      const input = this.searchInput?.nativeElement;
      if (input && activo !== input && !(activo instanceof HTMLInputElement)) {
        input.focus();
      }
    }, 150);
  }

  onSearchChange(): void {
    this.noEncontrado = false;
    this.errorMsg = '';
  }

  onEnter(): void {
    const termino = this.searchTerm.trim();
    if (!termino || this.buscando) return;

    console.log('Buscando término:', termino);

    this.buscando = true;
    this.noEncontrado = false;

    this.subs.add(
      this.productosService.buscar(termino, 0, 10).pipe(
        catchError((err) => {
          console.log('Error en buscar (catchError):', err);
          return of([]);
        })
      ).subscribe({
        next: (productos: Producto[]) => {
          console.log('Respuesta de buscar:', productos);
          this.buscando = false;

          if (!productos || productos.length === 0) {
            this.mostrarNoEncontrado();
            return;
          }
          const esCodigo = /^\d+$/.test(termino) && termino.length >= 4;
          if (esCodigo) {
            const exacto = productos.find(p =>
              p.codigos_barras?.some(cb => cb.codigo === termino)
            );
            console.log('Producto seleccionado (código):', exacto ?? productos[0]);
            this.agregarProducto(exacto ?? productos[0]);
          } else {
            const exacto = productos.find(
              p => p.nombre.toLowerCase() === termino.toLowerCase()
            );
            console.log('Producto seleccionado (nombre):', exacto ?? productos[0]);
            this.agregarProducto(exacto ?? productos[0]);
          }
        },
        error: (err) => {
          console.log('Error en subscribe buscar:', err);
          this.buscando = false;
          this.mostrarNoEncontrado();
        }
      })
    );
  }

  private mostrarNoEncontrado(): void {
    this.noEncontrado = true;
    this.searchTerm = '';
    setTimeout(() => { this.noEncontrado = false; }, 2500);
    this.enfocarInput();
  }

  agregarProducto(producto: Producto): void {
    const carrito = this.carritoEstado.carrito;
    const existente = carrito.find(i => i.producto.id_producto === producto.id_producto);

    if (producto.stock === 0) {
      this.errorMsg = `"${producto.nombre}" está agotado`;
      setTimeout(() => { this.errorMsg = ''; }, 3000);
    } else if (existente && existente.cantidad >= producto.stock) {
      this.errorMsg = `Stock máximo: "${producto.nombre}" (${producto.stock} disponibles)`;
      setTimeout(() => { this.errorMsg = ''; }, 3000);
    } else {
      this.carritoEstado.agregar({ producto, cantidad: 1, id_descuento: null });
      this.carritoEstado.setVentaExitosa(false);
    }

    this.searchTerm = '';
    this.enfocarInput();
  }

  onCantidadChange(event: { id_producto: number; cantidad: number }): void {
    const item = this.carritoEstado.carrito.find(
      i => i.producto.id_producto === event.id_producto
    );
    if (item) {
      const cantidad = Math.min(Math.max(1, event.cantidad), item.producto.stock);
      this.carritoEstado.actualizar(event.id_producto, cantidad);
    }
  }

  onEliminarItem(id_producto: number): void {
    this.carritoEstado.eliminar(id_producto);
    this.enfocarInput();
  }

  vaciarCarrito(): void {
    this.carritoEstado.vaciar();
    this.carritoEstado.setVentaExitosa(false);
    this.enfocarInput();
  }
}