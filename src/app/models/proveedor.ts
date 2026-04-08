export interface ProveedorCreate {
  nombre: string;
  contacto?: string;
  direccion?: string;
  estado?: string;
}

export interface ProveedorRead {
  id_proveedor: number;
  nombre: string;
  contacto: string | null;
  direccion: string | null;
  estado: string;
  fecha_registro: string;
}

export interface ProveedorUpdate extends Partial<ProveedorCreate> {}