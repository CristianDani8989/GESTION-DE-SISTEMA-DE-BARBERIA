import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// ✅ NO se necesita HttpClientModule aquí porque provideHttpClient() está en app.config.ts
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ limpio, sin HttpClientModule redundante
  templateUrl: './login.html'
})
export class Login {

  usuario   = '';
  password  = '';
  error     = '';
  cargando  = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.usuario || !this.password) {
      this.error = 'Completa todos los campos';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.http.post<any>('http://localhost:3000/api/login', {
      usuario:  this.usuario,
      password: this.password
    }).subscribe({
      next: () => {
        localStorage.setItem('admin', 'true');
        this.cargando = false;
        this.router.navigate(['/admin']); // ✅ flujo Login → Dashboard
      },
      error: () => {
        this.error   = 'Usuario o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}
