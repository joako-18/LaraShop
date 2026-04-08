import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialAccionRead } from '../models';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private url = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getHistorialEmpleado(empleadoId: number, skip = 0, limit = 50): Observable<HistorialAccionRead[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<HistorialAccionRead[]>(
      `${this.url}/empleados/${empleadoId}/historial`, { params }
    );
  }

  getAll(skip = 0, limit = 100): Observable<HistorialAccionRead[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<HistorialAccionRead[]>(`${this.url}/historial/`, { params });
  }
}