import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from './productos.service';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  id_descuento?: number | null;
}

@Injectable({ providedIn: 'root' })
export class CarritoEstadoService {

  private _carrito$ = new BehaviorSubject<ItemCarrito[]>([]);
  private _finalizando$ = new BehaviorSubject<boolean>(false);
  private _ventaExitosa$ = new BehaviorSubject<boolean>(false);

  readonly carrito$ = this._carrito$.asObservable();
  readonly finalizando$ = this._finalizando$.asObservable();
  readonly ventaExitosa$ = this._ventaExitosa$.asObservable();

  get carrito(): ItemCarrito[] { return this._carrito$.value; }
  get finalizando(): boolean { return this._finalizando$.value; }

  get total(): number {
    return this._carrito$.value.reduce((acc, i) => {
      const precio = i.producto.precio_venta
        ? Number(i.producto.precio_venta)
        : Number(i.producto.precio);
      return acc + (precio * i.cantidad);
    }, 0);
  }

  setCarrito(items: ItemCarrito[]): void { this._carrito$.next(items); }
  setFinalizando(v: boolean): void { this._finalizando$.next(v); }
  setVentaExitosa(v: boolean): void { this._ventaExitosa$.next(v); }

  agregar(item: ItemCarrito): void {
    const actual = this._carrito$.value;
    const existente = actual.find(i => i.producto.id_producto === item.producto.id_producto);
    if (existente) {
      existente.cantidad++;
      this._carrito$.next([...actual]);
    } else {
      this._carrito$.next([...actual, item]);
    }
  }

  actualizar(id_producto: number, cantidad: number): void {
    this._carrito$.next(
      this._carrito$.value.map(i =>
        i.producto.id_producto === id_producto ? { ...i, cantidad } : i
      )
    );
  }

  eliminar(id_producto: number): void {
    this._carrito$.next(
      this._carrito$.value.filter(i => i.producto.id_producto !== id_producto)
    );
  }

  vaciar(): void { this._carrito$.next([]); }
}