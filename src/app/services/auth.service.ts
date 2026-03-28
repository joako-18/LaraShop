import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  rol: string;
  nombre: string;
  id_empleado: number;
}

export interface EmpleadoMe {
  id_empleado: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', correo)
      .set('password', contrasena);

    return this.http.post<LoginResponse>(`${this.url}/login`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(res => {
        sessionStorage.setItem('token', res.access_token);
        sessionStorage.setItem('rol', res.rol);
        sessionStorage.setItem('nombre', res.nombre);
        sessionStorage.setItem('id_empleado', String(res.id_empleado));
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('nombre');
    sessionStorage.removeItem('id_empleado');
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getRol(): string {
    return sessionStorage.getItem('rol') ?? '';
  }

  getNombre(): string {
    return sessionStorage.getItem('nombre') ?? '';
  }

  getIdEmpleado(): number {
    return Number(sessionStorage.getItem('id_empleado')) || 0;
  }

  isAdmin(): boolean {
    return this.getRol() === 'administrador';
  }

  getMe(): Observable<EmpleadoMe> {
    return this.http.get<EmpleadoMe>(`${this.url}/me`);
  }
}