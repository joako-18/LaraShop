export interface CategoriaCreate {
  nombre: string;
}

export interface CategoriaRead {
  id_categoria: number;
  nombre: string;
}

export interface CategoriaUpdate extends Partial<CategoriaCreate> {}