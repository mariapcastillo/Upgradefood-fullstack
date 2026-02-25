import { Component, inject, OnInit, signal } from '@angular/core';
import { IPlato } from '../../Interfaces/IPlatos';
import { Platos } from '../../Services/platos';
import { Router, RouterLink } from '@angular/router'; // Importante para navegar
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-platos',
  standalone: true, // Asegúrate de tener esto si usas Angular 17+
  imports: [RouterLink], // Aquí puedes añadir CommonModule si usas pipes antiguos, pero con @if no hace falta
  templateUrl: './lista-platos.html',
  styleUrl: './lista-platos.css',
})
export class ListaPlatos implements OnInit {
  // Inyecciones
  platoService = inject(Platos);
  router = inject(Router);

  // Signals y Variables
  isAdmin = false;
  arrPlatos = signal<IPlato[]>([]);
  indice = signal<number>(0);

  async ngOnInit() {
    // 1. Detectar Rol
    const role = localStorage.getItem('user_role');
    this.isAdmin = (role === 'admin');

    // 2. Cargar Platos
    await this.cargarPlatos();

    // 3. Auto-reproducción del carrusel cada 5 segundos
    setInterval(() => {
      this.modificarIndice(true);
    }, 5000);
  }

  async cargarPlatos() {
    try {
      const response = await this.platoService.getAll();
      console.log('Platos cargados:', response);
      this.arrPlatos.set(response);
    } catch (error) {
      console.error('Error al cargar platos:', error);
    }
  }

  modificarIndice(siguiente: boolean) {
    const total = this.arrPlatos().length;
    if (total === 0) return;

    this.indice.update(actual => {
      if (siguiente) {
        return (actual + 1) % total;
      } else {
        return (actual - 1 + total) % total;
      }
    });
  }

  irACrearPlato() {
    this.router.navigate(['/admin/create-plato']); 
  }

  editarPlato(plato: IPlato) {
    this.router.navigate(['/admin/edit-plato', plato.id]);
  }

  async borrarPlato(id: number | undefined) {
    if (!id) return;

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "El plato se desactivará del menú",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this.platoService.delete_plato(id); 
        await this.cargarPlatos(); // Recargamos la lista tras borrar
        Swal.fire('Eliminado', 'El plato ha sido eliminado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el plato', 'error');
      }
    }
  }

  volver() {
  // Usamos un ternario para decidir la ruta
  const rutaDestino = this.isAdmin ? '/admin' : '/landing';
  this.router.navigate([rutaDestino]);
}
}
 

