import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmpleadosService, EmpleadoRead } from '../../../services/empleados.service';
import { AdminEstadoService } from '../../../services/admin-estado.service';
import { ModalNuevoEmpleadoComponent } from '../../modals/modal-nuevo-empleado/modal-nuevo-empleado.component';
import { ModalHistorialComponent, EmpleadoDetalle } from '../../modals/modal-historial/modal-historial.component';

@Component({
  selector: 'app-card-empleado',
  imports: [CommonModule, AsyncPipe, FormsModule, ModalNuevoEmpleadoComponent, ModalHistorialComponent],
  templateUrl: './card-empleado.component.html',
  styleUrl: './card-empleado.component.css'
})
export class CardEmpleadoComponent implements OnInit {

  modalAbierto: boolean = false;
  modalHistorialAbierto: boolean = false;
  searchTerm: string = '';
  empleadoSeleccionado: EmpleadoDetalle | null = null;
  empleadoEditar: EmpleadoRead | null = null;
  cargando: boolean = false;
  errorMsg: string = '';

  constructor(
    private empleadosService: EmpleadosService,
    private adminEstado: AdminEstadoService
  ) {}

  ngOnInit(): void { this.cargarEmpleados(); }

  cargarEmpleados(): void {
    this.cargando = true;
    this.empleadosService.getAll().subscribe({
      next: (empleados) => { this.adminEstado.setEmpleados(empleados); this.cargando = false; },
      error: () => { this.cargando = false; this.errorMsg = 'Error al cargar empleados.'; }
    });
  }

  get empleadosFiltrados$(): Observable<EmpleadoRead[]> {
    return this.adminEstado.empleados$.pipe(
      map(empleados => {
        if (!this.searchTerm) return empleados;
        const term = this.searchTerm.toLowerCase();
        return empleados.filter(e =>
          e.nombre.toLowerCase().includes(term) || e.correo.toLowerCase().includes(term)
        );
      })
    );
  }

  verHistorial(empleado: EmpleadoRead): void {
    this.empleadoSeleccionado = {
      ...empleado,
      fechaIngreso: new Date(empleado.fecha_alta).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    };
    this.modalHistorialAbierto = true;
  }

  editarEmpleado(empleado: EmpleadoRead): void {
    this.empleadoEditar = empleado;
    this.modalAbierto = true;
  }

  eliminarEmpleado(id: number): void {
    this.empleadosService.delete(id).subscribe({
      next: () => { this.adminEstado.eliminarEmpleado(id); },
      error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al eliminar empleado.'; }
    });
  }

  onModalClosed(): void {
    this.modalAbierto = false;
    this.empleadoEditar = null;
  }

  onEmpleadoGuardado(data: any): void {
  if (data.modoEdicion && data.id) {
    const payload: any = {
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono || undefined,
      id_telegram: data.id_telegram ?? null,
      rol: data.rol as 'administrador' | 'empleado'
    };
    if (data.contrasena) payload.contrasena = data.contrasena;

    this.empleadosService.update(data.id, payload).subscribe({
      next: (actualizado) => { this.adminEstado.actualizarEmpleado(actualizado); },
      error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al actualizar empleado.'; }
    });
  } else {
    this.empleadosService.create({
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono || undefined,
      id_telegram: data.id_telegram ?? undefined,
      rol: data.rol as 'administrador' | 'empleado',
      contrasena: data.contrasena,
      estado: 'activo'
    }).subscribe({
      next: (nuevo) => { this.adminEstado.agregarEmpleado(nuevo); },
      error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al crear empleado.'; }
    });
  }
}
}