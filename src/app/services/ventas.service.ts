import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  VentaCreate, VentaRead,
  CorteCajaCreate, CorteCajaRead,
  AperturaCajaCreate, AperturaCajaRead,
  ResumenDia
} from '../models';

@Injectable({ providedIn: 'root' })
export class VentasService {
  private urlVentas    = `${environment.apiUrl}/ventas`;
  private urlCortes    = `${environment.apiUrl}/cortes-caja`;
  private urlAperturas = `${environment.apiUrl}/aperturas-caja`;

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

  createCorte(corte: CorteCajaCreate): Observable<CorteCajaRead> {
    return this.http.post<CorteCajaRead>(this.urlCortes + '/', corte);
  }

  getResumenCorte(): Observable<ResumenDia> {
    return this.http.get<ResumenDia>(`${this.urlCortes}/resumen-dia`);
  }

  getAperturaActiva(): Observable<AperturaCajaRead | null> {
    return this.http.get<AperturaCajaRead | null>(`${this.urlAperturas}/activa`);
  }

  getMontoSugerido(): Observable<{ monto_sugerido: number }> {
    return this.http.get<{ monto_sugerido: number }>(`${this.urlAperturas}/monto-sugerido`);
  }

  createApertura(data: AperturaCajaCreate): Observable<AperturaCajaRead> {
    return this.http.post<AperturaCajaRead>(this.urlAperturas + '/', data);
  }
}