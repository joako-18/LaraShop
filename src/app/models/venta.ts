export interface DetalleVentaCreate {
  id_producto: number;
  cantidad: number;
  id_descuento?: number | null;
}

export interface DetalleVentaRead {
  id_detalle: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_descuento: number | null;
}

export interface VentaCreate {
  id_empleado: number;
  monto_recibido: number;
  detalles: DetalleVentaCreate[];
}

export interface VentaRead {
  id_venta: number;
  id_empleado: number;
  fecha: string;
  total: number;
  monto_recibido: number;
  cambio: number;
  detalles: DetalleVentaRead[];
}

export interface CorteCajaCreate {
  id_empleado: number;
  monto_final: number;
  fondo_siguiente_dia: number;
  observaciones?: string;
}

export interface CorteCajaRead {
  id_corte: number;
  id_empleado: number;
  fecha: string;
  monto_inicial: number;
  monto_final: number;
  ingresos_totales: number;
  diferencia: number;
  fondo_siguiente_dia: number;
  observaciones: string | null;
}

export interface AperturaCajaCreate {
  id_empleado: number;
  monto_apertura: number;
}

export interface AperturaCajaRead {
  id_apertura: number;
  id_empleado: number;
  monto_apertura: number;
  fecha: string;
  cerrada: boolean;
}

export interface ResumenDia {
  cantidad_ventas: number;
  total_ventas: number;
  monto_inicial: number;
  hay_apertura: boolean;
}