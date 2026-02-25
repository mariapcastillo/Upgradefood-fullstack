import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IMenu } from '../Interfaces/IMenu';
import { IMenuDetalle, IVinculoPlato } from '../Interfaces/IMenuDetalle';



@Injectable({
  providedIn: 'root',
})
export class Menus {
  private HttpClient = inject(HttpClient);
  private base_url = 'https://upgradehubfinalproject-production.up.railway.app';
  
  
  getAll() {
    return firstValueFrom(
      this.HttpClient.get<IMenu[]>(`${this.base_url}/menus-semanales/`)
    )
  }
  
  getMenuId(id: number) {
    return firstValueFrom(
      this.HttpClient.get<IMenuDetalle>(`${this.base_url}/menus-semanales/${id}`)
    )
  }
  createMenu(menu: IMenu) {
    return firstValueFrom(
      this.HttpClient.post<IMenu>(`${this.base_url}/menus-semanales`, menu)
    )
  }

  deleteMenu(id: number) {
    return firstValueFrom(
      this.HttpClient.delete<{ "msg": string }>(`${this.base_url}/menus-semanales/${id}`)
    );
  }
  
  vincularPlato(datos: IVinculoPlato) {
    return firstValueFrom(
      this.HttpClient.post<any>(`${this.base_url}/menus-semanales/vincular-plato`, datos)
    );

    // ###TODO: me marie con este any no se que poner aca 
  }

  updateMenu(id: number, menu: IMenu) {
    return firstValueFrom(
      this.HttpClient.put<{ "msg": string }>(`${this.base_url}/menus-semanales/${id}`, menu)
    )
  }

  desvincularPlato(menuId: number, platoId: number) {
  return firstValueFrom(
    this.HttpClient.delete<{ "msg": string }>(
      `${this.base_url}/menus-semanales/desvincular-plato/${menuId}/${platoId}`
    )
  );
}
}