import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  constructor(private router: Router) {}

  get esAdmin(): boolean {
    return localStorage.getItem('admin') === 'true';
  }

  get esLoginPage(): boolean {
    return this.router.url === '/login';
  }

  cerrarSesion() {
    localStorage.removeItem('admin');
    this.router.navigate(['/']);
  }
}