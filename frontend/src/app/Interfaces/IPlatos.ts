export interface IPlato {
  id?: number;                // Opcional para la creación
  categoria: string;          // "entrante" | "sashimi" | "nigiri" | "maki" | "bao" | "postre"
  nombre: string;
  descripcion: string;
  precio: number;
  ingredientes: string;
  alergenos: string;
  info_nutricional: string;
  imagen_url: string;
  activo: number;             // 1 = activo, 0 = inactivo
}


export interface platoResponse {
  msg: string;
  item: IPlato;

}