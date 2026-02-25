import { IMenuDetalle } from './../Interfaces/IMenuDetalle';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IMesa } from '../Interfaces/IMesa';
import { IReserva, ReservaResponse } from '../Interfaces/IReserva';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private http = inject(HttpClient);
  private base_url = 'https://upgradehubfinalproject-production.up.railway.app';

  // ✅ AÑADIDO: headers con token para rutas protegidas
  private authHeaders() {
    const token = localStorage.getItem('token'); // IMPORTANTE: que el login guarde con esta key
    if (!token) return {};
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  getMesas() {
    return firstValueFrom(this.http.get<IMesa[]>(`${this.base_url}/mesas`));
  }

  createReserva(reserva: IReserva) {
    return firstValueFrom(
      this.http.post<ReservaResponse>(`${this.base_url}/reservas`, reserva)
    );
  }

  // 1) GET /reservas/me
  getMisReservas() {
    return firstValueFrom(
      this.http.get<IReserva[]>(
        `${this.base_url}/reservas/me`,
        this.authHeaders()
      )
    );
  }

  // 2) DELETE /reservas/{reserva_id}
  cancelarReserva(reservaId: number) {
    return firstValueFrom(
      this.http.delete(
        `${this.base_url}/reservas/${reservaId}`,
        this.authHeaders()
      )
    );
  }
  // 3) PATCH /review  ✅ usamos "resena" (igual que tu interfaz)
  enviarReview(payload: { reserva_id: number; resena: string }) {
    return firstValueFrom(
      this.http.patch(
        `${this.base_url}/review`,
        payload,
        this.authHeaders()
      )
    );
  }
  // ✅ GET /reservas (todas las reservas - gestión/admin)
getallReservas() {
  return firstValueFrom(
    this.http.get<IReserva[]>(
      `${this.base_url}/reservas`,
      this.authHeaders()
    )
  );
}
}