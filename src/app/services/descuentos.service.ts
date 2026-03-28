import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DescuentoCreate {
  tipo: 'porcentaje' | 'monto_fijo';
  valor: number;
  id_producto?: number | null;
  id_categoria?: number | null;
  aplica_total?: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  estado?: string;
}

export interface DescuentoRead {
  id_descuento: number;
  tipo: string;
  valor: number;
  id_producto: number | null;
  id_categoria: number | null;
  aplica_total: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  producto: { id_producto: number; nombre: string } | null;
  categoria: { id_categoria: number; nombre: string } | null;
}

export interface DescuentoUpdate extends Partial<DescuentoCreate> {}

@Injectable({ providedIn: 'root' })
export class DescuentosService {
  private url = `${environment.apiUrl}/descuentos`;

  constructor(private http: HttpClient) {}

  getAll(skip = 0, limit = 100): Observable<DescuentoRead[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<DescuentoRead[]>(this.url + '/', { params });
  }

  getById(id: number): Observable<DescuentoRead> {
    return this.http.get<DescuentoRead>(`${this.url}/${id}`);
  }

  create(descuento: DescuentoCreate): Observable<DescuentoRead> {
    return this.http.post<DescuentoRead>(this.url + '/', descuento);
  }

  update(id: number, descuento: DescuentoUpdate): Observable<DescuentoRead> {
    return this.http.put<DescuentoRead>(`${this.url}/${id}`, descuento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}