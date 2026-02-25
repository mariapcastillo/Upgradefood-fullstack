import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class Navbar implements OnInit {
  private router = inject(Router);
  
  menuOpen = false;
  isLogged = false;
  isAdmin = false;

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    // 1. Verificamos si existe el usuario (ajusta 'user' o 'token' según lo que guardes)
    const user = localStorage.getItem('user');
    this.isLogged = !!user;

    // 2. Verificamos el rol (ajusta 'user_role' según tu clave en localStorage)
    const role = localStorage.getItem('user_role');
    this.isAdmin = (role === 'admin');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onLogout() {
    // Limpiamos todo el rastro del usuario
    localStorage.clear(); 
    this.isLogged = false;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }
}