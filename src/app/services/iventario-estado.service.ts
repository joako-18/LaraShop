import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from './productos.service';

@Injectable({ providedIn: 'root' })
export class InventarioEstadoService {

  private _productos$ = new BehaviorSubject<Producto[]>([]);

  readonly productos$ = this._productos$.asObservable();

  readonly totalProductos$ = this.productos$.pipe(
    map(p => p.length)
  );

  readonly stockBajo$ = this.productos$.pipe(
    map(p => p.filter(x => x.stock <= x.stock_minimo && x.stock_minimo > 0).length)
  );

  readonly agotados$ = this.productos$.pipe(
    map(p => p.filter(x => x.stock === 0).length)
  );

  readonly valorTotal$ = this.productos$.pipe(
    map(p => p.reduce((acc, x) => acc + (Number(x.precio) * x.stock), 0))
  );

  setProductos(productos: Producto[]): void {
    this._productos$.next(productos);
  }

  agregarProducto(producto: Producto): void {
    this._productos$.next([...this._productos$.value, producto]);
  }

  actualizarProducto(actualizado: Producto): void {
    this._productos$.next(
      this._productos$.value.map(p =>
        p.id_producto === actualizado.id_producto ? actualizado : p
      )
    );
  }

  eliminarProducto(id: number): void {
    this._productos$.next(
      this._productos$.value.filter(p => p.id_producto !== id)
    );
  }

  getProductosActuales(): Producto[] {
    return this._productos$.value;
  }
}