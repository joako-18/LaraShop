import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, map } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProductosService, Producto } from '../../../services/productos.service';
import { InventarioService, CategoriaRead } from '../../../services/inventario.service';
import { InventarioEstadoService } from '../../../services/iventario-estado.service';
import { ImagenesService } from '../../../services/imagenes.service';
import { CardProductoInventarioImagenComponent } from '../card-producto-inventario-imagen/card-producto-inventario-imagen.component';
import { ModalNuevoProductoComponent } from '../../modals/modal-nuevo-producto/modal-nuevo-producto.component';

@Component({
  selector: 'app-card-inventario',
  imports: [CommonModule, AsyncPipe, FormsModule, CardProductoInventarioImagenComponent, ModalNuevoProductoComponent],
  templateUrl: './card-inventario.component.html',
  styleUrl: './card-inventario.component.css'
})
export class CardInventarioComponent implements OnInit, OnDestroy {

  vistaGrid: boolean = false;
  menuAbiertoId: number | null = null;
  modalNuevoProductoAbierto: boolean = false;
  productoEditar: Producto | null = null;
  categorias: CategoriaRead[] = [];
  cargando: boolean = false;
  errorMsg: string = '';

  paginaActual = signal(1);
  porPagina = signal(7);

  searchTerm = signal('');
  categoriaFiltro = signal('');
  estadoFiltro = signal('');

  readonly totalProductos$: Observable<number>;
  readonly stockBajo$: Observable<number>;
  readonly agotados$: Observable<number>;
  readonly valorTotal$: Observable<number>;

  readonly productosFiltradosTodos$: Observable<Producto[]>;

  readonly productosPagina$: Observable<Producto[]>;

  readonly totalPaginas$: Observable<number>;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private productosService: ProductosService,
    private inventarioService: InventarioService,
    private estadoService: InventarioEstadoService,
    private imagenesService: ImagenesService
  ) {
    this.totalProductos$ = this.estadoService.totalProductos$;
    this.stockBajo$ = this.estadoService.stockBajo$;
    this.agotados$ = this.estadoService.agotados$;
    this.valorTotal$ = this.estadoService.valorTotal$;

    this.productosFiltradosTodos$ = combineLatest([
      this.estadoService.productos$,
      toObservable(this.categoriaFiltro),
      toObservable(this.estadoFiltro)
    ]).pipe(
      map(([productos, categoria, estado]) =>
        productos.filter(p => {
          const matchCategoria = !categoria || p.categoria?.nombre === categoria;
          const matchEstado = !estado || this.getEstadoLabel(p) === estado;
          return matchCategoria && matchEstado;
        })
      )
    );

    this.totalPaginas$ = combineLatest([
      this.productosFiltradosTodos$,
      toObservable(this.porPagina)
    ]).pipe(
      map(([productos, porPagina]) => Math.max(1, Math.ceil(productos.length / porPagina)))
    );

    this.productosPagina$ = combineLatest([
      this.productosFiltradosTodos$,
      toObservable(this.paginaActual),
      toObservable(this.porPagina)
    ]).pipe(
      map(([productos, pagina, porPagina]) => {
        const inicio = (pagina - 1) * porPagina;
        return productos.slice(inicio, inicio + porPagina);
      })
    );
  }
  getFilasFantasma(cantidadActual: number): number[] {
  const faltantes = this.porPagina() - cantidadActual;
  return faltantes > 0 ? Array(faltantes).fill(0) : [];
}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();

    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q || q.trim().length < 1) return this.productosService.getAll();
        return this.productosService.buscar(q.trim());
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (productos) => {
        this.estadoService.setProductos(productos);
        this.paginaActual.set(1);
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productosService.getAll().subscribe({
      next: (productos) => {
        this.estadoService.setProductos(productos);
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.errorMsg = 'Error al cargar productos.';
      }
    });
  }

  cargarCategorias(): void {
    this.inventarioService.getCategorias().subscribe({
      next: (cats) => { this.categorias = cats; },
      error: () => {}
    });
  }

  onSearchChange(valor: string): void {
    this.searchTerm.set(valor);
    this.paginaActual.set(1);
    this.cargando = true;
    this.searchSubject.next(valor);
  }

  onCategoriaChange(valor: string): void {
    this.categoriaFiltro.set(valor);
    this.paginaActual.set(1);
  }

  onEstadoChange(valor: string): void {
    this.estadoFiltro.set(valor);
    this.paginaActual.set(1);
  }

  irAPagina(pagina: number): void {
    this.paginaActual.set(pagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 1) this.paginaActual.update(p => p - 1);
  }

  paginaSiguiente(totalPaginas: number): void {
    if (this.paginaActual() < totalPaginas) this.paginaActual.update(p => p + 1);
  }

  getPaginas(totalPaginas: number): number[] {
    const pagina = this.paginaActual();
    const rango = 2;
    const inicio = Math.max(1, pagina - rango);
    const fin = Math.min(totalPaginas, pagina + rango);
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  }

  getEstadoLabel(producto: Producto): string {
    if (producto.stock === 0) return 'Agotado';
    if (producto.stock <= producto.stock_minimo && producto.stock_minimo > 0) return 'Stock bajo';
    return 'En stock';
  }

  getEstadoClass(producto: Producto): string {
    switch (this.getEstadoLabel(producto)) {
      case 'En stock':   return 'estado-en-stock';
      case 'Stock bajo': return 'estado-stock-bajo';
      case 'Agotado':    return 'estado-agotado';
      default: return '';
    }
  }

  getImagenUrl(imagen: string | null): string | null {
    return this.imagenesService.getUrlCompleta(imagen);
  }

  toggleMenu(id: number): void {
    this.menuAbiertoId = this.menuAbiertoId === id ? null : id;
  }

  editarProducto(producto: Producto): void {
    this.productoEditar = producto;
    this.modalNuevoProductoAbierto = true;
    this.menuAbiertoId = null;
  }

  eliminarProducto(id: number): void {
    this.productosService.delete(id).subscribe({
      next: () => {
        this.estadoService.eliminarProducto(id);
        this.menuAbiertoId = null;
      },
      error: (err) => {
        this.errorMsg = err.error?.detail ?? 'Error al eliminar producto.';
        this.menuAbiertoId = null;
      }
    });
  }

  onModalClosed(): void {
    this.modalNuevoProductoAbierto = false;
    this.productoEditar = null;
  }

  onProductoGuardado(data: any): void {
  if (data.modoEdicion && data.id) {
    this.productosService.update(data.id, {
      nombre:       data.nombre,
      precio:       data.precio,
      precio_venta: data.precioVenta ?? null,
      stock:        data.cantidad,
      stock_minimo: data.cantidadMinima,
      talla:        data.talla ?? null,
      id_categoria: data.id_categoria,
      id_proveedor: data.id_proveedor,
      imagen:       data.imagen ?? null
    }).subscribe({
      next: (actualizado) => { this.estadoService.actualizarProducto(actualizado); },
      error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al actualizar producto.'; }
    });
  } else {
    this.productosService.create({
      nombre:        data.nombre,
      precio:        data.precio,
      precio_venta:  data.precioVenta ?? null,
      stock:         data.cantidad,
      stock_minimo:  data.cantidadMinima ?? 0,
      talla:         data.talla ?? null,
      id_categoria:  data.id_categoria,
      id_proveedor:  data.id_proveedor,
      imagen:        data.imagen ?? null,
      estado:        'activo',
      codigo_barras: data.codigoBarras || null
    }).subscribe({
      next: (nuevo) => {
        this.estadoService.agregarProducto(nuevo);
        this.paginaActual.set(1);
      },
      error: (err) => { this.errorMsg = err.error?.detail ?? 'Error al crear producto.'; }
    });
  }
}
}