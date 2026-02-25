export interface IMenu {
  id: number;
  numero?: number;
  titulo: string; 
  descripcion: string;
  fecha: string;
  foto_url?: string,
  precio: number;
  activo: number;             // 1 = activo, 0 = inactivo
}

