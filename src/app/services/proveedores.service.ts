import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProveedorCreate {
  nombre: string;
  contacto?: string;
  direccion?: string;
  estado?: string;
}

export interface ProveedorRead {
  id_proveedor: number;
  nombre: string;
  contacto: string | null;
  direccion: string | null;
  estado: string;
  fecha_registro: string;
}

export interface ProveedorUpdate extends Partial<ProveedorCreate> {}

@Injectable({ providedIn: 'root' })
export class ProveedoresService {
  private url = `${environment.apiUrl}/proveedores`;

  constructor(private http: HttpClient) {}

  getAll(skip = 0, limit = 100): Observable<ProveedorRead[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<ProveedorRead[]>(this.url + '/', { params });
  }

  getById(id: number): Observable<ProveedorRead> {
    return this.http.get<ProveedorRead>(`${this.url}/${id}`);
  }

  create(proveedor: ProveedorCreate): Observable<ProveedorRead> {
    return this.http.post<ProveedorRead>(this.url + '/', proveedor);
  }

  update(id: number, proveedor: ProveedorUpdate): Observable<ProveedorRead> {
    return this.http.put<ProveedorRead>(`${this.url}/${id}`, proveedor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}