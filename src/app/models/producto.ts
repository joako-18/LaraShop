import { CategoriaRead } from './categoria';
import { ProveedorRead } from './proveedor'; 

export interface CodigoBarras {
  id_codigo: number;
  codigo: string;
}

export interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
  precio_venta: number | null;
  stock: number;
  stock_minimo: number;
  talla: string | null;
  id_categoria: number;
  id_proveedor: number;
  imagen: string | null;
  estado: 'activo' | 'inactivo';
  categoria: CategoriaRead | null;
  proveedor: ProveedorRead | null;
  codigos_barras?: CodigoBarras[];
}

export interface ProductoCreate {
  nombre: string;
  precio: number;
  precio_venta?: number | null;
  stock: number;
  stock_minimo: number;
  talla?: string | null;
  id_categoria: number;
  id_proveedor: number;
  imagen?: string | null;
  estado?: string;
  codigo_barras?: string | null;
}

export interface ProductoUpdate extends Partial<ProductoCreate> {}