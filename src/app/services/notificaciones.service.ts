import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificacionWS, NotificacionRead } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificacionesService implements OnDestroy {

  private ws: WebSocket | null = null;
  private notificacion$ = new Subject<NotificacionWS>();
  private wsUrl = environment.apiUrl.replace('http', 'ws').replace('/v1', '') + '/v1/ws/notificaciones';

  constructor(private http: HttpClient) {}

  conectar(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.ws = new WebSocket(this.wsUrl);
    this.ws.onmessage = (event) => {
      try { this.notificacion$.next(JSON.parse(event.data)); } catch {}
    };
    this.ws.onclose = () => setTimeout(() => this.conectar(), 5000);
  }

  desconectar(): void { this.ws?.close(); this.ws = null; }

  onNotificacion(): Observable<NotificacionWS> { return this.notificacion$.asObservable(); }

  getAll(skip = 0, limit = 50): Observable<NotificacionRead[]> {
    return this.http.get<NotificacionRead[]>(
      `${environment.apiUrl}/notificaciones/?skip=${skip}&limit=${limit}`
    );
  }

  ngOnDestroy(): void { this.desconectar(); }
}