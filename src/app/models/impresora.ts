import { ItemCarrito } from "./carrito";

export interface DatosTicket {
  idVenta: number;
  fecha: string;
  empleado: string;
  items: ItemCarrito[];
  subTotal: number;
  descuento: number;
  iva: number;
  total: number;
  montoRecibido: number;
  cambio: number;
}