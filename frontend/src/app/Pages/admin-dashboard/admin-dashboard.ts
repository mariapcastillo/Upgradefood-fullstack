import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { IMenu } from '../../Interfaces/IMenu';
import { Menus } from '../../Services/menus';
import { CommonModule } from '@angular/common';
import { IMenuDetalle } from '../../Interfaces/IMenuDetalle';
import { RouterLink } from '@angular/router';
import { CreateMenu } from '../../Components/create-menu/create-menu';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CreateMenu],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

  
  arrMenu = signal<IMenu[]>([]);
  MenuService = inject(Menus);
  menuSeleccionado = signal<IMenuDetalle | null>(null);

  async ngOnInit() {
    await this.obtenerTodosLosMenus();
  }


  // Función para pedir todos los menús al servidor
  async obtenerTodosLosMenus() {
    const response = await this.MenuService.getAll();
    console.log('Lista de menús cargada', response);
    this.arrMenu.set(response);
  }

  // Esta función se activa cuando el componente CreateMenu emite el evento 'menuCreado'
  async onMenuCreado() {
    console.log('El formulario nos avisa: Menú creado. Recargando lista...');
    await this.obtenerTodosLosMenus();
  }

  async deleteMenu(id: number) {
    const response = await this.MenuService.deleteMenu(id);
    console.log(response);
    await this.obtenerTodosLosMenus();
    
      
    };
  }
