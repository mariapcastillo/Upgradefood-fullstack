export interface IMesa {
    id?: number; 
    numero_mesa: number;
    capacidad: number;
    estado?: string; 
}

// Interfaz para la respuesta de la API al crear/actualizar
export interface MesaResponse {
    msg: string;
    item: IMesa;
}