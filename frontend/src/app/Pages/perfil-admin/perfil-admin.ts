import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-admin',
  imports: [],
  templateUrl: './perfil-admin.html',
  styleUrl: './perfil-admin.css',
})
export class PerfilAdmin {

  private router = inject(Router);
  
  irAGestionarMenus() {
    this.router.navigate(['admin-dashboard']);
  }

  irAVerResenas() {
    this.router.navigate(['/resenas']);
  }

  irAGestionarReservas() {
    this.router.navigate(['/admin/reservas']);
  }

  irAGestionarPlatos() {
  this.router.navigate(['lista_platos']); 
}

irAGestionarMesas() {
  this.router.navigate(['admin/gestion-mesas']);
}
  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_apellido');
  localStorage.removeItem('user_id');

  this.router.navigateByUrl('/login');
}
}


