import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DetalleVentaCreate {
  id_producto: number;
  cantidad: number;
  id_descuento?: number | null;
}

export interface DetalleVentaRead {
  id_detalle: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_descuento: number | null;
}

export interface VentaCreate {
  id_empleado: number;
  monto_recibido: number;
  detalles: DetalleVentaCreate[];
}

export interface VentaRead {
  id_venta: number;
  id_empleado: number;
  fecha: string;
  total: number;
  monto_recibido: number;
  cambio: number;
  detalles: DetalleVentaRead[];
}

export interface ResumenDia {
  cantidad_ventas: number;
  total_ventas: number;
}

export interface CorteCajaCreate {
  id_empleado: number;
  monto_final: number;
  observaciones?: string;
}

export interface CorteCajaRead {
  id_corte: number;
  id_empleado: number;
  fecha: string;
  monto_inicial: number;
  monto_final: number;
  ingresos_totales: number;
  observaciones: string | null;
}

export interface AperturaCajaRead {
  id_apertura: number;
  id_empleado: number;
  monto_apertura: number;
  fecha: string;
  cerrada: boolean;
}

export interface ResumenDia {
  cantidad_ventas: number;
  total_ventas: number;
  monto_inicial: number;
  hay_apertura: boolean;
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  private urlVentas = `${environment.apiUrl}/ventas`;
  private urlCortes = `${environment.apiUrl}/cortes-caja`;

  constructor(private http: HttpClient) {}

  getAll(skip = 0, limit = 100): Observable<VentaRead[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<VentaRead[]>(this.urlVentas + '/', { params });
  }

  getById(id: number): Observable<VentaRead> {
    return this.http.get<VentaRead>(`${this.urlVentas}/${id}`);
  }

  create(venta: VentaCreate): Observable<VentaRead> {
    return this.http.post<VentaRead>(this.urlVentas + '/', venta);
  }

  getResumenDelDia(): Observable<ResumenDia> {
    return this.http.get<ResumenDia>(`${this.urlVentas}/del-dia`);
  }

  getAllCortes(skip = 0, limit = 100): Observable<CorteCajaRead[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<CorteCajaRead[]>(this.urlCortes + '/', { params });
  }

  getCorteById(id: number): Observable<CorteCajaRead> {
    return this.http.get<CorteCajaRead>(`${this.urlCortes}/${id}`);
  }

  createCorte(corte: CorteCajaCreate): Observable<CorteCajaRead> {
    return this.http.post<CorteCajaRead>(this.urlCortes + '/', corte);
  }

  getResumenCorte(): Observable<ResumenDia> {
    return this.http.get<ResumenDia>(`${this.urlCortes}/resumen-dia`);
  }

  private urlAperturas = `${environment.apiUrl}/aperturas-caja`;

  getAperturaActiva(): Observable<AperturaCajaRead | null> {
    return this.http.get<AperturaCajaRead | null>(`${this.urlAperturas}/activa`);
  }

  getMontoSugerido(): Observable<{ monto_sugerido: number }> {
    return this.http.get<{ monto_sugerido: number }>(`${this.urlAperturas}/monto-sugerido`);
  }

  createApertura(id_empleado: number, monto_apertura: number): Observable<AperturaCajaRead> {
    return this.http.post<AperturaCajaRead>(this.urlAperturas + '/', { id_empleado, monto_apertura });
  }
}