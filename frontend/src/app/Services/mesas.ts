import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IMesa } from '../Interfaces/IMesa';

@Injectable({
  providedIn: 'root',
})
export class Mesas {
  
  private HttpClient = inject(HttpClient);
  private base_url = 'https://upgradehubfinalproject-production.up.railway.app';

  getAll() {
    return firstValueFrom(
      this.HttpClient.get<IMesa[]>(`${this.base_url}/mesas`)
    )
  }

  createTable(mesa: IMesa) {
    return firstValueFrom(
      this.HttpClient.post<{ msg: string }>(`${this.base_url}/mesas`, mesa)
    )
  }
 
  updateTable(id: number, mesa: IMesa) {
    return firstValueFrom(
      this.HttpClient.put<{ msg: string }>(`${this.base_url}/mesas/${id}`, mesa)
    )
  }

  deleteTable(id: number) {
    return firstValueFrom(
      this.HttpClient.delete<{ msg: string }>(`${this.base_url}/mesas/${id}`)
    )
  } 

}
