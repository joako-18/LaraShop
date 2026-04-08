import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DatosTicket } from '../models';

@Injectable({ providedIn: 'root' })
export class ImpresoraService {
  private url = `${environment.apiUrl}/impresora`;

  constructor(private http: HttpClient) {}

  imprimirTicket(datos: DatosTicket): Observable<void> {
    const payload = {
      id_venta:       datos.idVenta,
      fecha:          datos.fecha,
      empleado:       datos.empleado,
      items: datos.items.map(i => ({
        nombre:   i.producto.nombre,
        precio:   i.producto.precio_venta ?? Number(i.producto.precio),
        cantidad: i.cantidad,
        subtotal: (i.producto.precio_venta ?? Number(i.producto.precio)) * i.cantidad
      })),
      sub_total:      datos.subTotal,
      descuento:      datos.descuento,
      iva:            datos.iva,
      total:          datos.total,
      monto_recibido: datos.montoRecibido,
      cambio:         datos.cambio
    };

    return this.http.post<void>(`${this.url}/ticket`, payload).pipe(
      tap(() => console.log('Ticket enviado a imprimir')),
      catchError(err => {
        console.warn('No se pudo imprimir:', err?.error?.detail ?? err.message);
        return of(undefined as void);
      })
    );
  }

  verificarEstado(): Observable<{ disponible: boolean; mensaje: string }> {
    return this.http.get<{ disponible: boolean; mensaje: string }>(`${this.url}/estado`);
  }
}