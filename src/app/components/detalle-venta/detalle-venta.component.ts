import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ModalCorteCajaComponent } from '../modals/modal-corte-caja/modal-corte-caja.component';
import { ModalConfirmacionComponent } from '../modals/modal-confirmacion/modal-confirmacion.component';
import { ModalExitoVentaComponent } from '../modals/modal-exito-venta/modal-exito-venta.component';
import { VentasService, VentaRead } from '../../services/ventas.service';
import { AuthService } from '../../services/auth.service';
import { CarritoEstadoService, ItemCarrito } from '../../services/carrito-estado.service';

@Component({
  selector: 'app-detalle-venta',
  imports: [
    CommonModule, FormsModule,
    ModalCorteCajaComponent,
    ModalConfirmacionComponent,
    ModalExitoVentaComponent
  ],
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.css'
})
export class DetalleVentaComponent implements OnInit, OnDestroy {

  modalCorteCajaAbierto: boolean = false;
  modalConfirmacionAbierto: boolean = false;
  modalExitoAbierto: boolean = false;

  ultimaVenta: VentaRead | null = null;
  cantidadRecibida: string = '';
  cargando: boolean = false;
  procesando: boolean = false;

  totalUltimaVenta: number = 0;
  cambioUltimaVenta: number = 0;

  carrito$!: Observable<ItemCarrito[]>;
  ventaExitosa$!: Observable<boolean>;
  finalizando$!: Observable<boolean>;

  private sub = new Subscription();

  constructor(
    private ventasService: VentasService,
    private authService: AuthService,
    private carritoEstado: CarritoEstadoService
  ) {
    this.carrito$ = this.carritoEstado.carrito$;
    this.ventaExitosa$ = this.carritoEstado.ventaExitosa$;
    this.finalizando$ = this.carritoEstado.finalizando$;
  }

  ngOnInit(): void {
    this.cargarUltimaVenta();
    this.sub.add(
      this.carritoEstado.ventaExitosa$.subscribe(exito => {
        if (exito) this.cargarUltimaVenta();
      })
    );
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  cargarUltimaVenta(): void {
    this.cargando = true;
    this.ventasService.getAll(0, 1).subscribe({
      next: (ventas) => {
        this.ultimaVenta = ventas.length > 0 ? ventas[0] : null;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  get cambio(): number {
    const recibido = parseFloat(this.cantidadRecibida) || 0;
    const total = this.carritoEstado.total;
    return recibido >= total ? recibido - total : 0;
  }

  get fechaHoy(): string {
    return new Date().toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  get nombreEmpleado(): string { return this.authService.getNombre(); }

  get idVenta(): string {
    if (!this.ultimaVenta) return '—';
    return String(this.ultimaVenta.id_venta + 1).padStart(7, '0');
  }

  get subTotal(): number { return this.carritoEstado.total; }

  get puedeFinalizarVenta(): boolean {
    const recibido = parseFloat(this.cantidadRecibida) || 0;
    return (
      this.carritoEstado.carrito.length > 0 &&
      recibido >= this.carritoEstado.total &&
      this.carritoEstado.total > 0 &&
      !this.procesando
    );
  }

  get resumenParaConfirmacion(): string {
    const carrito = this.carritoEstado.carrito;
    const total = this.carritoEstado.total;
    const recibido = parseFloat(this.cantidadRecibida) || 0;
    const cambio = recibido - total;
    const items = carrito.length;
    return `${items} producto${items !== 1 ? 's' : ''} · Total: $${total.toFixed(2)} · Cambio: $${cambio.toFixed(2)}`;
  }

  solicitarConfirmacion(): void {
    if (!this.puedeFinalizarVenta) return;
    this.modalConfirmacionAbierto = true;
  }

  confirmarVenta(): void {
    const carrito = this.carritoEstado.carrito;
    if (carrito.length === 0) return;

    const idEmpleado = this.authService.getIdEmpleado();
    const montoRecibido = parseFloat(this.cantidadRecibida);
    const total = this.carritoEstado.total;

    this.procesando = true;
    this.carritoEstado.setFinalizando(true);
    this.modalConfirmacionAbierto = false;

    this.ventasService.create({
      id_empleado: idEmpleado,
      monto_recibido: montoRecibido,
      detalles: carrito.map(i => ({
        id_producto: i.producto.id_producto,
        cantidad: i.cantidad,
        id_descuento: i.id_descuento ?? null
      }))
    }).subscribe({
      next: () => {
        this.procesando = false;
        this.carritoEstado.setFinalizando(false);
        this.carritoEstado.setVentaExitosa(true);

        this.totalUltimaVenta = total;
        this.cambioUltimaVenta = montoRecibido - total;

        this.carritoEstado.vaciar();
        this.modalExitoAbierto = true;
      },
      error: (err) => {
        this.procesando = false;
        this.carritoEstado.setFinalizando(false);
        console.error(err.error?.detail ?? 'Error al procesar la venta.');
      }
    });
  }

  onExitoCerrado(): void {
    this.modalExitoAbierto = false;
    this.cantidadRecibida = '';
    this.carritoEstado.setVentaExitosa(false);
  }

  onCorteFinalizado(corte: any): void {
    console.log('Corte finalizado:', corte);
  }
}