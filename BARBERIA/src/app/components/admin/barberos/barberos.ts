import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberosServices, Barbero } from '../../../services/barbero';

@Component({
  selector: 'app-admin-barberos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barberos.html',
})
export class AdminBarberos implements OnInit {

  barberos:    Barbero[] = [];
  nombre       = '';
  especialidad = '';
  cargando     = true;

  constructor(private api: BarberosServices, private cd: ChangeDetectorRef) {}

  ngOnInit() { this.cargarBarberos(); }

  cargarBarberos() {
    this.cargando = true;
    this.api.getBarberos().subscribe({
      next: (res) => {
        this.barberos = res;
        this.cargando = false;
        this.cd.detectChanges(); 
      },
      error: () => {
        this.cargando = false;
        this.cd.detectChanges(); 
      }
    });
  }

  agregarBarbero() {
    if (!this.nombre || !this.especialidad) { alert('Completa todos los campos'); return; }
    this.api.addBarbero({ nombre: this.nombre, especialidad: this.especialidad }).subscribe(() => {
      this.nombre = ''; this.especialidad = '';
      this.cargarBarberos();
    });
  }

  eliminarBarbero(id: number) {
    if (!confirm('¿Eliminar este barbero?')) return;
    this.api.deleteBarbero(id).subscribe(() => this.cargarBarberos());
  }
}