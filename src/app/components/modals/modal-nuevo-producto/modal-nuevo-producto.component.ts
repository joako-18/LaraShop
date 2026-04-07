import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaRead } from '../../../services/inventario.service';
import { ProveedorRead, ProveedoresService } from '../../../services/proveedores.service';
import { Producto } from '../../../services/productos.service';
import { ImagenesService } from '../../../services/imagenes.service';

@Component({
  selector: 'app-modal-nuevo-producto',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-nuevo-producto.component.html',
  styleUrl: './modal-nuevo-producto.component.css'
})
export class ModalNuevoProductoComponent implements OnInit, OnChanges {

  @Input() isOpen: boolean = false;
  @Input() categorias: CategoriaRead[] = [];
  @Input() productoEditar: Producto | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<any>();

  proveedores: ProveedorRead[] = [];
  imagenPreview: string | null = null;
  imagenArchivoNombre: string | null = null;
  subiendoImagen: boolean = false;
  modoEdicion: boolean = false;

  tallasOpciones = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
                    '28', '30', '32', '34', '36', '38', '40',
                    '5', '5.5', '6', '6.5', '7', '7.5', '8',
                    '8.5', '9', '9.5', '10', '10.5', '11', 'Única'];

  form = {
    codigoBarras:  '',
    nombre:        '',
    precio:        null as number | null,
    precioVenta:   null as number | null,
    cantidad:      null as number | null,
    cantidadMinima: null as number | null,
    talla:         '' as string,
    id_categoria:  null as number | null,
    id_proveedor:  null as number | null
  };

  constructor(
    private proveedoresService: ProveedoresService,
    private imagenesService: ImagenesService
  ) {}

  ngOnInit(): void {
    this.proveedoresService.getAll().subscribe({
      next: (provs) => { this.proveedores = provs; },
      error: () => {}
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoEditar'] && this.productoEditar) {
      this.modoEdicion = true;
      this.form = {
        codigoBarras:   this.productoEditar.codigos_barras?.[0]?.codigo ?? '',
        nombre:         this.productoEditar.nombre,
        precio:         Number(this.productoEditar.precio),
        precioVenta:    this.productoEditar.precio_venta ? Number(this.productoEditar.precio_venta) : null,
        cantidad:       this.productoEditar.stock,
        cantidadMinima: this.productoEditar.stock_minimo,
        talla:          this.productoEditar.talla ?? '',
        id_categoria:   this.productoEditar.id_categoria,
        id_proveedor:   this.productoEditar.id_proveedor
      };
      if (this.productoEditar.imagen) {
        this.imagenArchivoNombre = this.productoEditar.imagen;
        this.imagenPreview = this.imagenesService.getUrlCompleta(this.productoEditar.imagen);
      }
    } else if (changes['productoEditar'] && !this.productoEditar) {
      this.modoEdicion = false;
      this.resetForm();
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) this.cerrar();
  }

  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) await this.procesarImagen(input.files[0]);
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) await this.procesarImagen(file);
  }

  private async procesarImagen(file: File): Promise<void> {
    const reader = new FileReader();
    reader.onload = (e) => { this.imagenPreview = e.target?.result as string; };
    reader.readAsDataURL(file);
    this.subiendoImagen = true;
    this.imagenesService.subirImagen(file).subscribe({
      next: (res) => {
        this.imagenArchivoNombre = res.nombre_archivo;
        this.subiendoImagen = false;
      },
      error: () => {
        this.subiendoImagen = false;
        this.imagenPreview = null;
        this.imagenArchivoNombre = null;
      }
    });
  }

  cerrar(): void {
    this.resetForm();
    this.closed.emit();
  }

  guardar(): void {
    if (!this.form.nombre || !this.form.precio || !this.form.cantidad ||
        !this.form.id_categoria || !this.form.id_proveedor || this.subiendoImagen) return;

    this.guardado.emit({
      id:             this.productoEditar?.id_producto ?? null,
      codigoBarras:   this.form.codigoBarras,
      nombre:         this.form.nombre,
      precio:         this.form.precio,
      precioVenta:    this.form.precioVenta,
      cantidad:       this.form.cantidad,
      cantidadMinima: this.form.cantidadMinima ?? 0,
      talla:          this.form.talla || null,
      id_categoria:   this.form.id_categoria,
      id_proveedor:   this.form.id_proveedor,
      imagen:         this.imagenArchivoNombre,
      modoEdicion:    this.modoEdicion
    });
    this.cerrar();
  }

  private resetForm(): void {
    this.form = {
      codigoBarras:   '',
      nombre:         '',
      precio:         null,
      precioVenta:    null,
      cantidad:       null,
      cantidadMinima: null,
      talla:          '',
      id_categoria:   null,
      id_proveedor:   null
    };
    this.imagenPreview = null;
    this.imagenArchivoNombre = null;
    this.subiendoImagen = false;
    this.modoEdicion = false;
  }
}