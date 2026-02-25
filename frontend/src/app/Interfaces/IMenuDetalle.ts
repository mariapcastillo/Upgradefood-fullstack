import { IPlato } from './IPlatos'; //ya tenia la de platos hecha 

export interface IMenuDetalle {
  menu: {
    id: number;
    numero: number;
    titulo: string;
    descripcion: string;
    precio: number;
    activo: number;
  };
  platos: IPlatoConRol[]; // Usamos una extensión de IPlato
}

export interface IPlatoConRol extends IPlato {
  rol: string; 
}

export interface IVinculoPlato {
  menu_id: number;
  plato_id: number;
  rol: 'entrante' | 'principal' | 'postre'; //
}

// esta es la tabla menu_semnal_detalle del backend