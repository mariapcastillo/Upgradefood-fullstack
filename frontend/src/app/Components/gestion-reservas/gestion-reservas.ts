import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReservaService } from '../../Services/reserva-service'; 
import { IReserva } from '../../Interfaces/IReserva';
import { DatePipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-gestion-reservas', // Tu selector
  standalone: true,
  imports: [NgClass, RouterLink, DatePipe], 
  templateUrl: './gestion-reservas.html',
  styleUrl: './gestion-reservas.css',
})
export class GestionReservas implements OnInit { // Tu nombre de clase
  
  private reservasService = inject(ReservaService);
  private cdr = inject(ChangeDetectorRef);

  listaReservas: IReserva[] = [];
  isAdmin: boolean = false;
  userId: number | null = null;
  router = inject(Router);

  async ngOnInit() {
    const role = localStorage.getItem('user_role');
    const idStored = localStorage.getItem('user_id');

    this.isAdmin = role === 'admin';
    this.userId = idStored ? parseInt(idStored) : null;

    await this.cargarReservas();
  }

  async cargarReservas() {
    try {
      const todas = await this.reservasService.getallReservas();
      
      if (this.isAdmin) {
        this.listaReservas = todas;
      } else {
        this.listaReservas = todas.filter((res: IReserva) => res.usuario_id === this.userId);
      }

      // Forzamos la detección de cambios para que la vista se actualice
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
    }
  }

  volver() {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/perfil-usuario']);
    }
  }
}