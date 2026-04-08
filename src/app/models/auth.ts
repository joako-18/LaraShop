export interface LoginResponse {
  access_token: string;
  token_type: string;
  rol: string;
  nombre: string;
  id_empleado: number;
}

export interface EmpleadoMe {
  id_empleado: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
}