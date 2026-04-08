import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Producto, ProductoCreate, ProductoUpdate } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private url = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  getAll(skip = 0, limit = 100): Observable<Producto[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<Producto[]>(this.url + '/', { params });
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  buscar(q: string, skip = 0, limit = 50): Observable<Producto[]> {
    const params = new HttpParams().set('q', q.trim()).set('skip', skip).set('limit', limit);
    return this.http.get<Producto[]>(`${this.url}/buscar`, { params });
  }

  getByCodigoBarras(codigo: string): Observable<Producto | null> {
    return this.http.get<Producto>(
      `${environment.apiUrl}/codigos-barras/${encodeURIComponent(codigo)}`
    ).pipe(catchError(() => of(null)));
  }

  create(producto: ProductoCreate): Observable<Producto> {
    return this.http.post<Producto>(this.url + '/', producto);
  }

  update(id: number, producto: ProductoUpdate): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, producto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}