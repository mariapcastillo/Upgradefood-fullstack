
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-usuario.html',
  styleUrls: ['./perfil-usuario.css'],
})
export class PerfilUsuario implements OnInit {
router = inject(Router);
  
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  rolUsuario: string = '';

  ngOnInit() {
    // Obtener datos del usuario desde localStorage
    this.nombreUsuario = localStorage.getItem('user_name') || 'Usuario';
    this.apellidoUsuario = localStorage.getItem('user_apellido') || '';
    this.rolUsuario = localStorage.getItem('user_role') || '';

    // Verificar que sea usuario cliente
    if (this.rolUsuario !== 'cliente') {
      this.router.navigateByUrl('/');
    }
  }

  // Métodos de navegación
  irAEfectuarReserva() {
    this.router.navigateByUrl('/reserva');
  }

  irAVerReservas() {
    this.router.navigateByUrl('/mis-reservas');
  }

  irAGestionarReservasModal() {
    // Esta opción podría abrir un modal o ir a una página
    this.router.navigateByUrl('/admin/reservas');
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  irAMisDatos() {
  this.router.navigateByUrl('/mis-datos');
}
 }

