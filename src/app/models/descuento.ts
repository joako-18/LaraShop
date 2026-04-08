export interface DescuentoCreate {
  tipo: 'porcentaje' | 'monto_fijo';
  valor: number;
  id_producto?: number | null;
  id_categoria?: number | null;
  aplica_total?: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  estado?: string;
}

export interface DescuentoRead {
  id_descuento: number;
  tipo: string;
  valor: number;
  id_producto: number | null;
  id_categoria: number | null;
  aplica_total: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  producto: { id_producto: number; nombre: string } | null;
  categoria: { id_categoria: number; nombre: string } | null;
}

export interface DescuentoUpdate extends Partial<DescuentoCreate> {}