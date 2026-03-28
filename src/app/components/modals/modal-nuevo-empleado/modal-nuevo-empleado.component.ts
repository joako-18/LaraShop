import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoRead } from '../../../services/empleados.service';

@Component({
  selector: 'app-modal-nuevo-empleado',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-nuevo-empleado.component.html',
  styleUrl: './modal-nuevo-empleado.component.css'
})
export class ModalNuevoEmpleadoComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() empleadoEditar: EmpleadoRead | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  errorMsg: string = '';
  modoEdicion: boolean = false;

  form = {
    nombre: '',
    correo: '',
    telefono: '',
    id_telegram: '',
    rol: 'empleado',
    contrasena: '',
    confirmarContrasena: ''
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleadoEditar'] && this.empleadoEditar) {
      this.modoEdicion = true;
      this.form = {
        nombre: this.empleadoEditar.nombre,
        correo: this.empleadoEditar.correo,
        telefono: this.empleadoEditar.telefono ?? '',
        id_telegram: this.empleadoEditar.id_telegram != null
          ? String(this.empleadoEditar.id_telegram)
          : '',
        rol: this.empleadoEditar.rol,
        contrasena: '',
        confirmarContrasena: ''
      };
    } else if (changes['empleadoEditar'] && !this.empleadoEditar) {
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
    this.errorMsg = '';

    if (!this.form.nombre || !this.form.correo) {
      this.errorMsg = 'Nombre y correo son requeridos.';
      return;
    }
    if (!this.modoEdicion && this.form.contrasena.length < 8) {
      this.errorMsg = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }
    if (this.form.contrasena && this.form.contrasena !== this.form.confirmarContrasena) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    let idTelegram: number | null = null;
    const telegramStr = String(this.form.id_telegram ?? '').trim();
    if (telegramStr !== '') {
      const parsed = parseInt(telegramStr, 10);
      if (isNaN(parsed)) {
        this.errorMsg = 'El ID de Telegram debe ser un número entero.';
        return;
      }
      idTelegram = parsed;
    }

    const payload: any = {
      id: this.empleadoEditar?.id_empleado ?? null,
      nombre: this.form.nombre,
      correo: this.form.correo,
      telefono: this.form.telefono || null,
      id_telegram: idTelegram,
      rol: this.form.rol,
      modoEdicion: this.modoEdicion
    };

    if (this.form.contrasena) payload.contrasena = this.form.contrasena;

    this.guardado.emit(payload);
    this.cerrar();
  }

  private resetForm(): void {
    this.form = {
      nombre: '',
      correo: '',
      telefono: '',
      id_telegram: '',
      rol: 'empleado',
      contrasena: '',
      confirmarContrasena: ''
    };
    this.errorMsg = '';
    this.modoEdicion = false;
  }
}