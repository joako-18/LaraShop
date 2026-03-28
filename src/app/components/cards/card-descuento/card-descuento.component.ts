import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DescuentosService, DescuentoRead } from '../../../services/descuentos.service';
import { AdminEstadoService } from '../../../services/admin-estado.service';
import { ModalNuevoDescuentoComponent } from '../../modals/modal-nuevo-descuento/modal-nuevo-descuento.component';

@Component({
  selector: 'app-card-descuento',
  imports: [CommonModule, FormsModule, ModalNuevoDescuentoComponent],
  templateUrl: './card-descuento.component.html',
  styleUrl: './card-descuento.component.css'
})
export class CardDescuentoComponent implements OnInit {

  modalAbierto: boolean = false;
  searchTerm: string = '';
  descuentoEditar: DescuentoRead | null = null;
  cargando: boolean = false;
  errorMsg: string = '';

  constructor(
    private descuentosService: DescuentosService,
    private adminEstado: AdminEstadoService
  ) {}

  ngOnInit(): void { this.cargarDescuentos(); }

  cargarDescuentos(): void {
    this.cargando = true;
    this.descuentosService.getAll().subscribe({
      next: (descuentos) => { this.adminEstado.setDescuentos(descuentos); this.cargando = false; },
      error: () => { this.cargando = false; this.errorMsg = 'Error al cargar descuentos.'; }
    });
  }

  get descuentosFiltrados$(): Observable<DescuentoRead[]> {
    return this.adminEstado.descuentos$.pipe(
      map(descuentos => {
        if (!this.searchTerm) return descuentos;
        const term = this.searchTerm.toLowerCase();
        return descuentos.filter(d =>
          d.producto?.nombre.toLowerCase().includes(term) ||
          d.categoria?.nombre.toLowerCase().includes(term) ||
          d.tipo.toLowerCase().includes(term)
        );
      })
    );
  }

  getEstadoLabel(descuento: DescuentoRead): string {
    const hoy = new Date();
    const inicio = new Date(descuento.fecha_inicio);
    const fin = new Date(descuento.fecha_fin);
    if (descuento.estado === 'inactivo') return 'Expirado';
    if (inicio > hoy) return 'Programado';
    if (fin < hoy) return 'Expirado';
    return 'Activo';
  }

  getEstadoClass(descuento: DescuentoRead): string {
    switch (this.getEstadoLabel(descuento)) {
      case 'Activo': return '';
      case 'Programado': return 'programado';
      case 'Expirado': return 'expirado';
      default: return '';
    }
  }

  getNombreDescuento(d: DescuentoRead): string {
    if (d.producto) return d.producto.nombre;
    if (d.categoria) return d.categoria.nombre;
    return 'Descuento general';
  }

  getCategoriaLabel(d: DescuentoRead): string {
    if (d.categoria) return d.categoria.nombre;
    if (d.producto) return 'Producto';
    return 'Total';
  }

  getValorLabel(d: DescuentoRead): string {
    return d.tipo === 'porcentaje' ? `${d.valor}%` : `$${d.valor}`;
  }

  editarDescuento(descuento: DescuentoRead): void {
    this.descuentoEditar = descuento;
    this.modalAbierto = true;
  }

  eliminarDescuento(id: number): void {
    this.descuentosService.delete(id).subscribe({
      next: () => { this.adminEstado.eliminarDescuento(id); },
      error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al eliminar descuento.'; }
    });
  }

  onModalClosed(): void {
    this.modalAbierto = false;
    this.descuentoEditar = null;
  }

  onDescuentoGuardado(data: any): void {
    const payload = {
      tipo: data.tipo as 'porcentaje' | 'monto_fijo',
      valor: data.valor,
      id_categoria: data.id_categoria || null,
      id_producto: data.id_producto || null,
      aplica_total: data.aplica_total ?? false,
      fecha_inicio: data.fechaInicio,
      fecha_fin: data.fechaFin,
      estado: 'activo' as const
    };
    if (data.modoEdicion && data.id) {
      this.descuentosService.update(data.id, payload).subscribe({
        next: (actualizado) => { this.adminEstado.actualizarDescuento(actualizado); },
        error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al actualizar descuento.'; }
      });
    } else {
      this.descuentosService.create(payload).subscribe({
        next: (nuevo) => { this.adminEstado.agregarDescuento(nuevo); },
        error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al crear descuento.'; }
      });
    }
  }
}