export interface ReservaCreate {
    fecha: string;
    hora: string;
    mesa_id: number;
    party_size: number;
    resena?: string;
}  

export interface ReservaResponse {
    msg: string;
    item: {
        id: number;
        usuario_id: number;
        mesa_id: number;
        fecha: string;
        hora: string;
        party_size: number;
        estado: string;
        resena: string | null;
        created_at: string;
    };
    
}

export interface IReserva {
    id?: number;          // Opcional, lo crea el backend
    usuario_id?: number;  // Lo saca el backend del token
    mesa_id: number;      // Obligatorio
    fecha: string;        // Formato YYYY-MM-DD
    hora: string | number;  // Formato HH:mm o segundos desde medianoche
    party_size: number;   // Cantidad de personas
    estado?: 'confirmada' | 'cancelada' | 'completada';
    resena?: string;      // Observaciones

    resena_id?: number;          // ID de la reseña (tabla resenas)
    comentario_resena?: string;  // El comentario de la reseña
    puntuacion?: number;         // La nota de la reseña
}