import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CarritoVentaComponent } from '../../components/carrito-venta/carrito-venta.component';
import { DetalleVentaComponent } from '../../components/detalle-venta/detalle-venta.component';
import { ModalAperturaCajaComponent } from '../../components/modals/modal-apertura-caja/modal-apertura-caja.component';
import { VentasService } from '../../services/ventas.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    NavbarComponent,
    CarritoVentaComponent,
    DetalleVentaComponent,
    ModalAperturaCajaComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  // true mientras se verifica si hay apertura activa
  verificando: boolean = true;

  // true si hay apertura registrada hoy → se puede vender
  aperturaActiva: boolean = false;

  // controla si el modal de apertura está visible
  modalAperturaAbierto: boolean = false;

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.verificarApertura();
  }

  verificarApertura(): void {
    this.verificando = true;
    this.ventasService.getAperturaActiva().subscribe({
      next: (apertura) => {
        this.aperturaActiva    = apertura !== null;
        this.modalAperturaAbierto = !this.aperturaActiva;
        this.verificando = false;
      },
      error: () => {
        // Si falla la verificación, pedir apertura por seguridad
        this.aperturaActiva    = false;
        this.modalAperturaAbierto = true;
        this.verificando = false;
      }
    });
  }

  onAperturaRegistrada(): void {
    this.aperturaActiva       = true;
    this.modalAperturaAbierto = false;
  }
}