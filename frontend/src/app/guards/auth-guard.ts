import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  
  // ✅ Si el usuario intenta ir a login/registro, no bloquees ni alertes
  if (state.url === '/login' || state.url === '/registro') {
    return true;
  }

  if (!token) {
    // ✅ Evita el Swal si la navegación ya es hacia /login
    router.navigate(['/login']);
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'Debes iniciar sesión para ver esta página',
      confirmButtonColor: '#ffc107',
    });
    return false;
  }

  return true;
};
