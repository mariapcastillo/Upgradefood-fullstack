export interface IUsuario {
  id?: number; 
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  password: string;
  telefono: string;
  edad: number; 
  alergias: string;
  rol: string //'cliente' | 'admin'; por defecto saiemre cliente 
}


export interface RegisterResponse {
  msg: string;      // Mensaje informativo: "usuario registrado correctamente"
  item: IUsuario;   // El objeto usuario creado
}

export interface ILogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  msg: string;
  Token: string;
  user: IUsuario;
}

export interface IUsuarioUpdatePayload {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  edad?: number;
  alergias?: string;
}


/// esta seria el model de UsuarioOut del backend
export interface IUsuarioOut {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string | null;
  edad: number;
  alergias?: string | null;
  rol: string;
}

export interface UsuarioUpdateResponse {
  msg: string;
  user: IUsuarioOut; 
}


export interface PasswordUpdatePayload {
  current_password: string;
  new_password: string;
}

export interface PasswordUpdateResponse {
  msg: string;
}