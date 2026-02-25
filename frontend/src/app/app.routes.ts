import { MisReservas } from './Pages/mis-reservas/mis-reservas';
import { Component } from '@angular/core';
import { Menu } from './Pages/menu/menu';
import { Routes } from '@angular/router';
import { Home } from './Pages/home/home';
import { Login } from './Pages/login/login';
import { Registro } from './Pages/registro/registro';
import { ListaPlatos } from './Pages/lista-platos/lista-platos';
import { AdminDashboard } from './Pages/admin-dashboard/admin-dashboard';
import { PerfilUsuario } from './Pages/perfil-usuario/perfil-usuario';
import { authGuard } from './guards/auth-guard';
import { CreateMenu } from './Components/create-menu/create-menu';
import { AsignarPlatos } from './Pages/asignar-platos/asignar-platos';
import { NotFound } from './Pages/not-found/not-found';
import { PerfilAdmin } from './Pages/perfil-admin/perfil-admin';
import { ResenasComponent } from './Components/resenas/resenas';
import { GestionReservas } from './Components/gestion-reservas/gestion-reservas';
import { CreatePlato } from './Pages/create-platos/create-platos';
import { EditPlato } from './Pages/edit-plato';
import { EditMenu } from './Pages/edit-menu/edit-menu';
import { Reserva } from './Pages/reservas/reservas';
import { GestionMesas } from './Pages/gestion-mesas/gestion-mesas';
import { CalendarioMenus } from './Pages/calendario-menus/calendario_reservas.';
import { MisDatos } from './Pages/mis-datos/mis-datos';
import { MenuDetail } from './Pages/menu-detail/menu-detail';
import { Aboutus } from './Pages/aboutus/aboutus';


export const routes: Routes = [
// --- RUTAS PÚBLICAS (Sin Guard) ---

    { path: '', component: Home },
    { path: 'landing', component: Home },
    { path: 'menus', component: Menu },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },
    { path: 'lista_platos', component: ListaPlatos },
    { path: 'menus/:id', component: MenuDetail },
    { path: 'about-us', component: Aboutus },
    { path: 'resenas', component: ResenasComponent },

    // --- PROTEGIDAS ---
    { path: 'perfil-usuario', component: PerfilUsuario, canActivate: [authGuard] },
    { path: 'reserva', component: Reserva, canActivate: [authGuard] },
    { path: 'mis-datos', component: MisDatos, canActivate: [authGuard] },
    
    // Rutas de Admin
    { path: 'admin', component: PerfilAdmin, canActivate: [authGuard] },
    { path: 'admin-dashboard', component: AdminDashboard, canActivate: [authGuard] }, // 
    { path: 'mis-reservas', component: MisReservas, canActivate: [authGuard] },
    { path: 'admin/reservas', component: GestionReservas, canActivate: [authGuard] },
    { path: 'calendario', component: CalendarioMenus, canActivate: [authGuard] },
    { path: 'admin/create-menu', component: CreateMenu, canActivate: [authGuard] },
    { path: 'admin/asignar-platos/:id', component: AsignarPlatos, canActivate: [authGuard] },
    { path: 'admin/create-plato', component: CreatePlato, canActivate: [authGuard] },
    { path: 'admin/edit-plato/:id', component: EditPlato, canActivate: [authGuard] },
    { path: 'admin/edit-menu/:id', component: EditMenu, canActivate: [authGuard] },
    { path: 'admin/gestion-mesas', component: GestionMesas, canActivate: [authGuard] },
    


    // --- RUTA 404 ---
    { path: '**', component: NotFound }

    
];

