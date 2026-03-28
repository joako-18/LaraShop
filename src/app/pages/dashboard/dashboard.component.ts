import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CarritoVentaComponent, ItemCarrito } from '../../components/carrito-venta/carrito-venta.component';
import { DetalleVentaComponent } from '../../components/detalle-venta/detalle-venta.component';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, CarritoVentaComponent, DetalleVentaComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {}