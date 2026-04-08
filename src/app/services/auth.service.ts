import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginResponse, EmpleadoMe } from '../models';

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
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean  { return !!sessionStorage.getItem('token'); }
  getRol(): string       { return sessionStorage.getItem('rol') ?? ''; }
  getNombre(): string    { return sessionStorage.getItem('nombre') ?? ''; }
  getIdEmpleado(): number { return Number(sessionStorage.getItem('id_empleado')) || 0; }
  isAdmin(): boolean     { return this.getRol() === 'administrador'; }

  getMe(): Observable<EmpleadoMe> {
    return this.http.get<EmpleadoMe>(`${this.url}/me`);
  }
}