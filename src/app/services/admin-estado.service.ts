import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProveedorRead } from './proveedores.service';
import { EmpleadoRead } from './empleados.service';
import { DescuentoRead } from './descuentos.service';
import { CategoriaRead } from './categorias.service';
import { ResumenEstadisticas } from './estadisticas.service';

@Injectable({ providedIn: 'root' })
export class AdminEstadoService {

  private _proveedores$ = new BehaviorSubject<ProveedorRead[]>([]);
  readonly proveedores$ = this._proveedores$.asObservable();

  setProveedores(p: ProveedorRead[]): void { this._proveedores$.next(p); }
  agregarProveedor(p: ProveedorRead): void { this._proveedores$.next([...this._proveedores$.value, p]); }
  actualizarProveedor(p: ProveedorRead): void {
    this._proveedores$.next(this._proveedores$.value.map(x => x.id_proveedor === p.id_proveedor ? p : x));
  }
  eliminarProveedor(id: number): void {
    this._proveedores$.next(this._proveedores$.value.filter(x => x.id_proveedor !== id));
  }

  private _empleados$ = new BehaviorSubject<EmpleadoRead[]>([]);
  readonly empleados$ = this._empleados$.asObservable();

  setEmpleados(e: EmpleadoRead[]): void { this._empleados$.next(e); }
  agregarEmpleado(e: EmpleadoRead): void { this._empleados$.next([...this._empleados$.value, e]); }
  actualizarEmpleado(e: EmpleadoRead): void {
    this._empleados$.next(this._empleados$.value.map(x => x.id_empleado === e.id_empleado ? e : x));
  }
  eliminarEmpleado(id: number): void {
    this._empleados$.next(this._empleados$.value.filter(x => x.id_empleado !== id));
  }

  private _descuentos$ = new BehaviorSubject<DescuentoRead[]>([]);
  readonly descuentos$ = this._descuentos$.asObservable();

  setDescuentos(d: DescuentoRead[]): void { this._descuentos$.next(d); }
  agregarDescuento(d: DescuentoRead): void { this._descuentos$.next([...this._descuentos$.value, d]); }
  actualizarDescuento(d: DescuentoRead): void {
    this._descuentos$.next(this._descuentos$.value.map(x => x.id_descuento === d.id_descuento ? d : x));
  }
  eliminarDescuento(id: number): void {
    this._descuentos$.next(this._descuentos$.value.filter(x => x.id_descuento !== id));
  }

  // ── Categorías ────────────────────────────────────────────────────────────
  private _categorias$ = new BehaviorSubject<CategoriaRead[]>([]);
  readonly categorias$ = this._categorias$.asObservable();

  setCategorias(c: CategoriaRead[]): void { this._categorias$.next(c); }
  agregarCategoria(c: CategoriaRead): void { this._categorias$.next([...this._categorias$.value, c]); }
  actualizarCategoria(c: CategoriaRead): void {
    this._categorias$.next(this._categorias$.value.map(x => x.id_categoria === c.id_categoria ? c : x));
  }
  eliminarCategoria(id: number): void {
    this._categorias$.next(this._categorias$.value.filter(x => x.id_categoria !== id));
  }

  private _estadisticas$ = new BehaviorSubject<ResumenEstadisticas | null>(null);
  readonly estadisticas$ = this._estadisticas$.asObservable();
  readonly resumen$ = this._estadisticas$.pipe(map(e => e?.resumen ?? null));
  readonly ventasPorMes$ = this._estadisticas$.pipe(map(e => e?.ventas_por_mes ?? []));
  readonly ventasSemanales$ = this._estadisticas$.pipe(map(e => e?.ventas_semanales ?? []));
  readonly ventasPorCategoria$ = this._estadisticas$.pipe(map(e => e?.ventas_por_categoria ?? []));

  setEstadisticas(e: ResumenEstadisticas): void { this._estadisticas$.next(e); }
  estadisticasCargadas(): boolean { return this._estadisticas$.value !== null; }
}