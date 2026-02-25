
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, IUsuario , IUsuarioOut, IUsuarioUpdatePayload, LoginResponse, PasswordUpdatePayload, PasswordUpdateResponse, RegisterResponse, UsuarioUpdateResponse } from '../Interfaces/IUsuario';


@Injectable({
  providedIn: 'root',
})
export class Usuarios {
  
  private http = inject(HttpClient);
  private base_url = 'https://upgradehubfinalproject-production.up.railway.app';


  //metodo post

  registro(nuevoUsuario: IUsuario) {
    return firstValueFrom(
      this.http.post<RegisterResponse>(`${this.base_url}/auth/register`, nuevoUsuario))
  }
  
  login(usuarioLog: { email: string, password: string }) {
    console.log("Enviando a:", `${this.base_url}/auth/login`);
    return firstValueFrom(
      this.http.post<LoginResponse>(`${this.base_url}/auth/login`, usuarioLog))
 
  }

  isLogged() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    return true;
  
  }

  getUserById(id: number) {
    return firstValueFrom
      (this.http.get<IUsuarioOut>(`${this.base_url}/usuarios/${id}`));
  }

  updateUser(id: number, payload: IUsuarioUpdatePayload) {
    return firstValueFrom(
      this.http.put<UsuarioUpdateResponse>(`${this.base_url}/usuarios/${id}`, payload)
    );
  }
  changePassword(id: number, payload: PasswordUpdatePayload) {
  return firstValueFrom(
    this.http.put<PasswordUpdateResponse>(`${this.base_url}/usuarios/${id}/password`, payload)
  );
  }
  
}
