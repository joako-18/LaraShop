import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProveedoresService } from '../../../services/proveedores.service';
import { ProveedorRead } from '../../../models';
import { AdminEstadoService } from '../../../services/admin-estado.service';
import { ModalNuevoProveedorComponent } from '../../modals/modal-nuevo-proveedor/modal-nuevo-proveedor.component';

@Component({
  selector: 'app-card-proveedor',
  imports: [CommonModule, AsyncPipe, FormsModule, ModalNuevoProveedorComponent],
  templateUrl: './card-proveedor.component.html',
  styleUrl: './card-proveedor.component.css'
})
export class CardProveedorComponent implements OnInit {

  modalAbierto: boolean = false;
  searchTerm: string = '';
  proveedorEditar: ProveedorRead | null = null;
  cargando: boolean = false;
  errorMsg: string = '';

  readonly proveedoresFiltrados$: Observable<ProveedorRead[]>;

  constructor(
    private proveedoresService: ProveedoresService,
    private adminEstado: AdminEstadoService
  ) {
    this.proveedoresFiltrados$ = this.adminEstado.proveedores$;
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.cargando = true;
    this.proveedoresService.getAll().subscribe({
      next: (proveedores) => {
        this.adminEstado.setProveedores(proveedores);
        this.cargando = false;
      },
      error: () => { this.cargando = false; this.errorMsg = 'Error al cargar proveedores.'; }
    });
  }

  get proveedoresFiltradosSync(): Observable<ProveedorRead[]> {
    return this.adminEstado.proveedores$.pipe(
      map(proveedores => {
        if (!this.searchTerm) return proveedores;
        const term = this.searchTerm.toLowerCase();
        return proveedores.filter(p =>
          p.nombre.toLowerCase().includes(term) ||
          p.contacto?.toLowerCase().includes(term)
        );
      })
    );
  }

  editarProveedor(proveedor: ProveedorRead): void {
    this.proveedorEditar = proveedor;
    this.modalAbierto = true;
  }

  eliminarProveedor(id: number): void {
    this.proveedoresService.delete(id).subscribe({
      next: () => { this.adminEstado.eliminarProveedor(id); },
      error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al eliminar proveedor.'; }
    });
  }

  onModalClosed(): void {
    this.modalAbierto = false;
    this.proveedorEditar = null;
  }

  onProveedorGuardado(data: any): void {
    if (data.modoEdicion && data.id) {
      this.proveedoresService.update(data.id, {
        nombre: data.nombre,
        contacto: data.contacto || undefined,
        direccion: data.direccion || undefined
      }).subscribe({
        next: (actualizado) => { this.adminEstado.actualizarProveedor(actualizado); },
        error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al actualizar proveedor.'; }
      });
    } else {
      this.proveedoresService.create({
        nombre: data.nombre,
        contacto: data.contacto || undefined,
        direccion: data.direccion || undefined,
        estado: 'activo'
      }).subscribe({
        next: (nuevo) => { this.adminEstado.agregarProveedor(nuevo); },
        error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al crear proveedor.'; }
      });
    }
  }
}