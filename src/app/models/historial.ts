export interface AccionRead {
  id_accion: number;
  nombre: string;
  descripcion: string | null;
}

export interface HistorialAccionRead {
  id_historial: number;
  id_empleado: number;
  fecha: string;
  accion: AccionRead;
}