import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResumenGeneral {
  ventas_del_mes: number;
  total_productos: number;
  productos_stock_bajo: number;
  ganancias_del_mes: number;
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

  getResumenGeneral(): Observable<ResumenGeneral> {
    return this.http.get<ResumenGeneral>(`${this.url}/resumen-general`);
  }

  getVentasPorMes(anio?: number): Observable<VentaPorMes[]> {
    let params = new HttpParams();
    if (anio) params = params.set('anio', anio);
    return this.http.get<VentaPorMes[]>(`${this.url}/ventas-por-mes`, { params });
  }

  getVentasSemanales(): Observable<VentaPorDia[]> {
    return this.http.get<VentaPorDia[]>(`${this.url}/ventas-semanales`);
  }

  getVentasPorCategoria(): Observable<VentaPorCategoria[]> {
    return this.http.get<VentaPorCategoria[]>(`${this.url}/ventas-por-categoria`);
  }

  getProductosMasVendidos(limit = 10): Observable<ProductoMasVendido[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<ProductoMasVendido[]>(`${this.url}/productos-mas-vendidos`, { params });
  }
}