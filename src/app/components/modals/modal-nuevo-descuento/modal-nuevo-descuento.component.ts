import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../../services/inventario.service';
import { CategoriaRead } from '../../../models';
import { ProductosService } from '../../../services/productos.service';
import { Producto } from '../../../models';
import { DescuentoRead } from '../../../models';

@Component({
  selector: 'app-modal-nuevo-descuento',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-nuevo-descuento.component.html',
  styleUrl: './modal-nuevo-descuento.component.css'
})
export class ModalNuevoDescuentoComponent implements OnInit, OnChanges {

  @Input() isOpen: boolean = false;
  @Input() descuentoEditar: DescuentoRead | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  categorias: CategoriaRead[] = [];
  productos: Producto[] = [];
  modoEdicion: boolean = false;

  form = {
    tipo: '',
    valor: null as number | null,
    id_categoria: null as number | null,
    id_producto: null as number | null,
    aplica_total: false,
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(
    private inventarioService: InventarioService,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.inventarioService.getCategorias().subscribe({ next: (cats) => { this.categorias = cats; } });
    this.productosService.getAll().subscribe({ next: (prods) => { this.productos = prods; } });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['descuentoEditar'] && this.descuentoEditar) {
      this.modoEdicion = true;
      this.form = {
        tipo: this.descuentoEditar.tipo,
        valor: Number(this.descuentoEditar.valor),
        id_categoria: this.descuentoEditar.id_categoria,
        id_producto: this.descuentoEditar.id_producto,
        aplica_total: this.descuentoEditar.aplica_total,
        fechaInicio: this.descuentoEditar.fecha_inicio,
        fechaFin: this.descuentoEditar.fecha_fin
      };
    } else if (changes['descuentoEditar'] && !this.descuentoEditar) {
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
    if (!this.form.tipo || !this.form.valor || !this.form.fechaInicio || !this.form.fechaFin) return;
    this.guardado.emit({
      id: this.descuentoEditar?.id_descuento ?? null,
      ...this.form,
      modoEdicion: this.modoEdicion
    });
    this.cerrar();
  }

  private resetForm(): void {
    this.form = {
      tipo: '', valor: null, id_categoria: null,
      id_producto: null, aplica_total: false,
      fechaInicio: '', fechaFin: ''
    };
    this.modoEdicion = false;
  }
}