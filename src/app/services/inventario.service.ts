import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CategoriaCreate { nombre: string; }
export interface CategoriaRead  { id_categoria: number; nombre: string; }

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private urlCategorias = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  getCategorias(skip = 0, limit = 100): Observable<CategoriaRead[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<CategoriaRead[]>(this.urlCategorias + '/', { params });
  }

  getCategoriaById(id: number): Observable<CategoriaRead> {
    return this.http.get<CategoriaRead>(`${this.urlCategorias}/${id}`);
  }

  createCategoria(categoria: CategoriaCreate): Observable<CategoriaRead> {
    return this.http.post<CategoriaRead>(this.urlCategorias + '/', categoria);
  }

  updateCategoria(id: number, categoria: Partial<CategoriaCreate>): Observable<CategoriaRead> {
    return this.http.put<CategoriaRead>(`${this.urlCategorias}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlCategorias}/${id}`);
  }
}