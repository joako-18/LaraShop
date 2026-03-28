import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmacion',
  imports: [CommonModule],
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.css'
})
export class ModalConfirmacionComponent {
  @Input() isOpen: boolean = false;
  @Input() titulo: string = '¿Confirmar acción?';
  @Input() mensaje: string = '';
  @Input() labelConfirmar: string = 'Confirmar';
  @Input() labelCancelar: string = 'Cancelar';
  @Input() cargando: boolean = false;

  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cancelado.emit();
    }
  }
}