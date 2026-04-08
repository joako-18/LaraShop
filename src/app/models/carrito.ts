import { Producto } from "./producto"; 

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  id_descuento?: number | null;
}