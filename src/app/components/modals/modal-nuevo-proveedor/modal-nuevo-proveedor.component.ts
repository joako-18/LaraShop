import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProveedorRead } from '../../../services/proveedores.service';

@Component({
  selector: 'app-modal-nuevo-proveedor',
  imports: [FormsModule],
  templateUrl: './modal-nuevo-proveedor.component.html',
  styleUrl: './modal-nuevo-proveedor.component.css'
})
export class ModalNuevoProveedorComponent implements OnChanges {

  @Input() isOpen: boolean = false;
  @Input() proveedorEditar: ProveedorRead | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  modoEdicion: boolean = false;
  form = { nombre: '', contacto: '', direccion: '' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proveedorEditar'] && this.proveedorEditar) {
      this.modoEdicion = true;
      this.form = {
        nombre: this.proveedorEditar.nombre,
        contacto: this.proveedorEditar.contacto ?? '',
        direccion: this.proveedorEditar.direccion ?? ''
      };
    } else if (changes['proveedorEditar'] && !this.proveedorEditar) {
      this.modoEdicion = false;
      this.resetForm();
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) this.cerrar();
  }

  cerrar(): void {
    this.resetForm();
    this.closed.emit();
  }

  guardar(): void {
    if (!this.form.nombre) return;
    this.guardado.emit({
      id: this.proveedorEditar?.id_proveedor ?? null,
      ...this.form,
      modoEdicion: this.modoEdicion
    });
    this.cerrar();
  }

  private resetForm(): void {
    this.form = { nombre: '', contacto: '', direccion: '' };
    this.modoEdicion = false;
  }
}