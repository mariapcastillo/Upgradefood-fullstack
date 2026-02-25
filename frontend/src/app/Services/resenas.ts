import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IResena } from '../Interfaces/Iresena';

@Injectable({
  providedIn: 'root',
})
export class Resenas {
  

  private http = inject(HttpClient);
  private base_url = 'https://upgradehubfinalproject-production.up.railway.app';

  getResenas() {
    return firstValueFrom(
      this.http.get<IResena[]>(`${this.base_url}/resenas/`)
    )
  
  }
 
  createResena(resena: IResena) {
    return firstValueFrom(
      this.http.post<IResena>(`${this.base_url}/resenas/`, resena)
    )
  }
  updateResena(id: number, resena: IResena) {
    return firstValueFrom(
      this.http.put<{ msg: string }>(`${this.base_url}/resenas/${id}`, resena)
    );
  }

  getMisResenas() {
  return firstValueFrom(
    this.http.get<IResena[]>(`${this.base_url}/resenas/mis-resenas`)
  );
}

}


