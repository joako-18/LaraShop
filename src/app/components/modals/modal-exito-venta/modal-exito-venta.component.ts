import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-exito-venta',
  imports: [CommonModule],
  templateUrl: './modal-exito-venta.component.html',
  styleUrl: './modal-exito-venta.component.css'
})
export class ModalExitoVentaComponent {
  @Input() isOpen: boolean = false;
  @Input() total: number = 0;
  @Input() cambio: number = 0;
  @Output() cerrado = new EventEmitter<void>();
}