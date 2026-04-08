import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoriaCreate, CategoriaRead, CategoriaUpdate } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private url = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  getAll(skip = 0, limit = 100): Observable<CategoriaRead[]> {
    const params = new HttpParams().set('skip', skip).set('limit', limit);
    return this.http.get<CategoriaRead[]>(this.url + '/', { params });
  }

  getById(id: number): Observable<CategoriaRead> {
    return this.http.get<CategoriaRead>(`${this.url}/${id}`);
  }

  create(categoria: CategoriaCreate): Observable<CategoriaRead> {
    return this.http.post<CategoriaRead>(this.url + '/', categoria);
  }

  update(id: number, categoria: CategoriaUpdate): Observable<CategoriaRead> {
    return this.http.put<CategoriaRead>(`${this.url}/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}