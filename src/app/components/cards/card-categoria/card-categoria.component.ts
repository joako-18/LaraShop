import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoriasService } from '../../../services/categorias.service';
import { CategoriaRead } from '../../../models';
import { AdminEstadoService } from '../../../services/admin-estado.service';
import { ModalNuevaCategoriaComponent } from '../../modals/modal-nueva-categoria/modal-nueva-categoria.component';

@Component({
  selector: 'app-card-categoria',
  imports: [CommonModule, AsyncPipe, FormsModule, ModalNuevaCategoriaComponent],
  templateUrl: './card-categoria.component.html',
  styleUrl: './card-categoria.component.css'
})
export class CardCategoriaComponent implements OnInit {

  modalAbierto: boolean = false;
  searchTerm: string = '';
  categoriaEditar: CategoriaRead | null = null;
  cargando: boolean = false;
  errorMsg: string = '';

  constructor(
    private categoriasService: CategoriasService,
    private adminEstado: AdminEstadoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.categoriasService.getAll().subscribe({
      next: (categorias) => {
        this.adminEstado.setCategorias(categorias);
        this.cargando = false;
      },
      error: () => { this.cargando = false; this.errorMsg = 'Error al cargar categorías.'; }
    });
  }

  get categoriasFiltradas$(): Observable<CategoriaRead[]> {
    return this.adminEstado.categorias$.pipe(
      map(categorias => {
        if (!this.searchTerm) return categorias;
        const term = this.searchTerm.toLowerCase();
        return categorias.filter(c => c.nombre.toLowerCase().includes(term));
      })
    );
  }

  editarCategoria(categoria: CategoriaRead): void {
    this.categoriaEditar = categoria;
    this.modalAbierto = true;
  }

  eliminarCategoria(id: number): void {
    this.errorMsg = '';
    this.categoriasService.delete(id).subscribe({
      next: () => { this.adminEstado.eliminarCategoria(id); },
      error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al eliminar categoría.'; }
    });
  }

  onModalClosed(): void {
    this.modalAbierto = false;
    this.categoriaEditar = null;
  }

  onCategoriaGuardada(data: any): void {
    if (data.modoEdicion && data.id) {
      this.categoriasService.update(data.id, { nombre: data.nombre }).subscribe({
        next: (actualizada) => { this.adminEstado.actualizarCategoria(actualizada); },
        error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al actualizar categoría.'; }
      });
    } else {
      this.categoriasService.create({ nombre: data.nombre }).subscribe({
        next: (nueva) => { this.adminEstado.agregarCategoria(nueva); },
        error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al crear categoría.'; }
      });
    }
  }
}