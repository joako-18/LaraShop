import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResumenEstadisticas } from '../models';

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