import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importante para ngModel
import { Mesas } from '../../Services/mesas';
import { IMesa } from '../../Interfaces/IMesa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-mesas',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './gestion-mesas.html',
  styleUrl: './gestion-mesas.css',
})
export class GestionMesas implements OnInit {
  tableService = inject(Mesas);
  arrTables = signal<IMesa[]>([]);
  
  // Lógica de UI
  showForm = false;
  editMode = false;
  mesaSeleccionada: any = { numero_mesa: 0, capacidad: 0 };

  async ngOnInit() {
    await this.cargarMesas();
  }

  async cargarMesas() {
    const detalle = await this.tableService.getAll();
    this.arrTables.set(detalle);
  }

  abrirFormulario(modo: 'crear' | 'editar', mesa?: IMesa) {
    this.showForm = true;
    if (modo === 'editar' && mesa) {
      this.editMode = true;
      this.mesaSeleccionada = { ...mesa }; // Copia para no editar el original antes de tiempo
    } else {
      this.editMode = false;
      this.mesaSeleccionada = { numero_mesa: 0, capacidad: 0 };
    }
  }

  async guardar() {
    try {
      if (this.editMode) {
        // Lógica Update
        await this.tableService.updateTable(this.mesaSeleccionada.id, this.mesaSeleccionada);
        Swal.fire('¡Éxito!', 'Mesa actualizada', 'success');
      } else {
        // Lógica Create
        await this.tableService.createTable(this.mesaSeleccionada);
        Swal.fire('¡Éxito!', 'Mesa creada', 'success');
      }
      this.showForm = false;
      await this.cargarMesas();
    } catch (error: any) {
      Swal.fire('Error', error.error?.detail || 'Algo salió mal', 'error');
    }
  }

  async eliminarMesa(id: number | undefined) {
    if (!id) return;
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    });

    if (result.isConfirmed) {
      await this.tableService.deleteTable(id);
      await this.cargarMesas();
      Swal.fire('Borrado', 'La mesa ha sido eliminada', 'success');
    }
  }
}
  
