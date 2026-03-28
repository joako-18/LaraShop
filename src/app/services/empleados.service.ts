import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmpleadoCreate {
  nombre: string;
  correo: string;
  telefono?: string;
  id_telegram?: number | null;
  rol: 'administrador' | 'empleado';
  estado?: string;
  contrasena: string;
}

export interface EmpleadoRead {
  id_empleado: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  id_telegram: number | null;
  rol: string;
  estado: string;
  fecha_alta: string;
}

export interface EmpleadoUpdate extends Partial<EmpleadoCreate> {}

@Injectable({ providedIn: 'root' })
export class EmpleadosService {
  private url = `${environment.apiUrl}/empleados`;

  constructor(private http: HttpClient) {}

  getAll(skip = 0, limit = 100): Observable<EmpleadoRead[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<EmpleadoRead[]>(this.url + '/', { params });
  }

  getById(id: number): Observable<EmpleadoRead> {
    return this.http.get<EmpleadoRead>(`${this.url}/${id}`);
  }

  create(empleado: EmpleadoCreate): Observable<EmpleadoRead> {
    return this.http.post<EmpleadoRead>(this.url + '/', empleado);
  }

  update(id: number, empleado: EmpleadoUpdate): Observable<EmpleadoRead> {
    return this.http.put<EmpleadoRead>(`${this.url}/${id}`, empleado);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}