import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResumenGeneral {
  ventas_del_mes: number;
  total_ingresos_venta: number;
  ganancias_del_mes: number;
  total_productos: number;
  productos_stock_bajo: number;
}

export interface VentaPorMes {
  mes: number;
  nombre_mes: string;
  total_ventas: number;
  total_ganancias: number;
}

export interface VentaPorDia {
  dia: string;
  nombre_dia: string;
  total_ventas: number;
}

export interface VentaPorCategoria {
  categoria: string;
  total_ventas: number;
  porcentaje: number;
}

export interface ProductoMasVendido {
  id_producto: number;
  nombre: string;
  cantidad_vendida: number;
  total_generado: number;
  porcentaje: number;
}

export interface ResumenEstadisticas {
  resumen: ResumenGeneral;
  ventas_por_mes: VentaPorMes[];
  ventas_semanales: VentaPorDia[];
  ventas_por_categoria: VentaPorCategoria[];
  productos_mas_vendidos: ProductoMasVendido[];
}

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private url = `${environment.apiUrl}/estadisticas`;

  constructor(private http: HttpClient) {}

  getResumenCompleto(anio?: number): Observable<ResumenEstadisticas> {
    let params = new HttpParams();
    if (anio) params = params.set('anio', anio);
    return this.http.get<ResumenEstadisticas>(`${this.url}/resumen`, { params });
  }
}