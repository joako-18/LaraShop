export interface ResumenGeneral {
  ventas_del_mes: number;
  total_ingresos_venta: number;
  ganancias_del_mes: number;
  total_productos: number;
  productos_stock_bajo: number;
}

export interface VentaPorMes {
  mes: number;
  nombre_mes: string;
  total_ventas: number;
  total_ganancias: number;
}

export interface VentaPorDia {
  dia: string;
  nombre_dia: string;
  total_ventas: number;
}

export interface VentaPorCategoria {
  categoria: string;
  total_ventas: number;
  porcentaje: number;
}

export interface ProductoMasVendido {
  id_producto: number;
  nombre: string;
  cantidad_vendida: number;
  total_generado: number;
  porcentaje: number;
}

export interface ResumenEstadisticas {
  resumen: ResumenGeneral;
  ventas_por_mes: VentaPorMes[];
  ventas_semanales: VentaPorDia[];
  ventas_por_categoria: VentaPorCategoria[];
  productos_mas_vendidos: ProductoMasVendido[];
}