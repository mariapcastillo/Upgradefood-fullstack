import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IPlato, platoResponse } from '../Interfaces/IPlatos';


@Injectable({
  providedIn: 'root',
})
export class Platos {
 
  private HttpClient = inject(HttpClient);
  private base_url = 'https://upgradehubfinalproject-production.up.railway.app';


  getAll() {
    return firstValueFrom(
      this.HttpClient.get<IPlato[]>(`${this.base_url}/platos/platos`)
    )
  }

editarPlato(id: number, plato: IPlato) {
  return firstValueFrom(
    this.HttpClient.put<{ msg: string }>(`${this.base_url}/platos/${id}`, plato)
  );
}

  delete_plato(id: number) {
  return firstValueFrom(
    this.HttpClient.delete<{ msg: string }>(`${this.base_url}/platos/${id}`)
  )
}

  createPlato(plato: IPlato) {
    return firstValueFrom(
      this.HttpClient.post<platoResponse>(`${this.base_url}/platos/`, plato)
    )

  }

  getPlatoById(id: number) {
    return firstValueFrom(
      this.HttpClient.get<IPlato>(`${this.base_url}/platos/${id}`)
    )
  }
}
