export interface NotificacionWS {
  tipo: string;
  producto_id: number;
  titulo: string;
  lineas: string[];
  tiempo: string;
}

export interface NotificacionRead {
  id_notificacion: number;
  id_producto: number;
  mensaje: string;
  stock_actual: number;
  fecha: string;
  enviada: boolean;
}