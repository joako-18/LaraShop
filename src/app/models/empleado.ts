export interface EmpleadoCreate {
  nombre: string;
  correo: string;
  telefono?: string;
  id_telegram?: number | null;
  rol: 'administrador' | 'empleado';
  estado?: string;
  contrasena: string;
}

export interface EmpleadoRead {
  id_empleado: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  id_telegram: number | null;
  rol: string;
  estado: string;
  fecha_alta: string;
}

export interface EmpleadoUpdate extends Partial<EmpleadoCreate> {}