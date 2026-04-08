import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ImagenUploadResponse } from '../models/imagen';

@Injectable({ providedIn: 'root' })
export class ImagenesService {
  private url     = `${environment.apiUrl}/imagenes/productos`;
  private baseUrl = environment.apiUrl.replace('/v1', '');

  constructor(private http: HttpClient) {}

  subirImagen(file: File): Observable<ImagenUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImagenUploadResponse>(this.url, formData);
  }

  eliminarImagen(nombreArchivo: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${nombreArchivo}`);
  }

  getUrlCompleta(nombreArchivo: string | null): string | null {
    if (!nombreArchivo) return null;
    if (nombreArchivo.startsWith('http')) return nombreArchivo;
    return `${this.baseUrl}/uploads/productos/${nombreArchivo}`;
  }
}