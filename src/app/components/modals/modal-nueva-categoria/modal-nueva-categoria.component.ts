import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaRead } from '../../../services/categorias.service';

@Component({
  selector: 'app-modal-nueva-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-nueva-categoria.component.html',
  styleUrl: './modal-nueva-categoria.component.css'
})
export class ModalNuevaCategoriaComponent implements OnChanges {

  @Input() isOpen: boolean = false;
  @Input() categoriaEditar: CategoriaRead | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  modoEdicion: boolean = false;
  errorMsg: string = '';

  form = { nombre: '' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoriaEditar'] && this.categoriaEditar) {
      this.modoEdicion = true;
      this.form = { nombre: this.categoriaEditar.nombre };
    } else if (changes['categoriaEditar'] && !this.categoriaEditar) {
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
    if (!this.form.nombre.trim()) {
      this.errorMsg = 'El nombre de la categoría es requerido.';
      return;
    }
    this.guardado.emit({
      id: this.categoriaEditar?.id_categoria ?? null,
      nombre: this.form.nombre.trim(),
      modoEdicion: this.modoEdicion
    });
    this.cerrar();
  }

  private resetForm(): void {
    this.form = { nombre: '' };
    this.errorMsg = '';
    this.modoEdicion = false;
  }
}