

import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { IMenuDetalle } from '../../Interfaces/IMenuDetalle';
import { Menus } from '../../Services/menus';
import { Platos } from '../../Services/platos';
import { CardMenu } from '../../Components/card-menu/card-menu';

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [CardMenu, RouterLink],
  templateUrl: './menu-detail.html',
  styleUrl: './menu-detail.css',
})
export class MenuDetail {
  menuSeleccionado = signal<IMenuDetalle | null>(null);
  isAdmin = signal(false);

  private MenuService = inject(Menus);
  private PlatoService = inject(Platos);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const role = localStorage.getItem('user_role')?.replace(/"/g, '');
    this.isAdmin.set(role === 'admin');

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) this.cargarDetalle(Number(idParam));
  }

  async cargarDetalle(id: number) {
    try {
      const detalle = await this.MenuService.getMenuId(id);
      this.menuSeleccionado.set(detalle);
    } catch (error) {
      console.error('Error al cargar el detalle', error);
    }
  }

  platosDelMenu() {
    return this.menuSeleccionado()?.platos || [];
  }

  async quitarPlato(platoId: number) {
    const detalle = this.menuSeleccionado();
    if (!detalle) return;

    const confirm = await Swal.fire({
      title: '¿Estás segura?',
      text: 'Vas a quitar este plato del menú actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar',
      background: '#111214',
      color: '#fff',
    });

    if (!confirm.isConfirmed) return;

    try {
      await this.MenuService.desvincularPlato(detalle.menu.id, platoId);

      await Swal.fire({
        title: '¡Hecho!',
        text: 'Plato desvinculado correctamente',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false,
        background: '#111214',
        color: '#fff',
      });

      await this.cargarDetalle(detalle.menu.id);
    } catch (error) {
      console.error('Error al desvincular', error);
      Swal.fire('Error', 'No se pudo quitar el plato', 'error');
    }
  }

  async verEspecificaciones(id: number) {
    try {
      const plato = await this.PlatoService.getPlatoById(id);

      Swal.fire({
        title: plato.nombre,
        html: `
          <div style="text-align: left;">
            <img src="${plato.imagen_url}" style="width:100%; border-radius:10px; margin-bottom:15px; border: 1px solid #333;">
            <p><strong>Descripción:</strong> ${plato.descripcion}</p>
            <p><strong>Ingredientes:</strong> ${plato.ingredientes}</p>
            <p><strong>Alérgenos:</strong> <span class="text-warning">${plato.alergenos}</span></p>
            <p><strong>Precio:</strong> <span style="color: #d4af37; font-weight: bold;">${plato.precio}€</span></p>
          </div>
        `,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#d4af37',
        background: '#111214',
        color: '#fff',
      });
    } catch (error) {
      console.error('No se pudo obtener el detalle del plato', error);
      Swal.fire('Error', 'No pudimos cargar los detalles del plato', 'error');
    }
  }
}
