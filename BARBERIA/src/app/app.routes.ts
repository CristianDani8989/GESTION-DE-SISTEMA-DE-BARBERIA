import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Guard: redirige a /login si no hay sesión de admin
const adminGuard = () => {
  const router = inject(Router);
  if (localStorage.getItem('admin') === 'true') return true;
  return router.createUrlTree(['/login']);
};

export const routes: Routes = [
  // Rutas públicas con lazy loading — cada componente se descarga SOLO cuando se navega a él
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then(m => m.Login)
  },
  {
    path: 'gestion',
    loadComponent: () => import('./components/gestion/gestion').then(m => m.Gestion)
  },

  // Rutas admin con lazy loading + guard
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/dashboard/dashboard').then(m => m.AdminDashboard)
  },
  {
    path: 'admin/servicios',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/servicios/servicios').then(m => m.AdminServicios)
  },
  {
    path: 'admin/barberos',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/barberos/barberos').then(m => m.AdminBarberos)
  },
  {
    path: 'admin/citas',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/citas/citas').then(m => m.AdminCitas)
  },

  { path: '**', redirectTo: '' }
];