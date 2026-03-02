import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BarberosServices } from '../../../services/barbero';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
})
export class AdminDashboard implements OnInit {

  totalBarberos = 0;
  totalServicios = 0;
  totalCitas = 0;
  ingresos = 0;
  cargando = true;
  errorCarga = false;

  constructor(private api: BarberosServices, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // Defer data loading to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => this.cargarDatos());
  }

  cargarDatos() {
    this.cargando = true;
    this.errorCarga = false;

    forkJoin({
      barberos: this.api.getBarberos(),
      servicios: this.api.getServicios(),
      citas: this.api.getCitas()
    }).subscribe({
      next: ({ barberos, servicios, citas }) => {
        this.totalBarberos = barberos.length;
        this.totalServicios = servicios.length;
        this.totalCitas = citas.length;

        let total = 0;
        citas.forEach((c: any) => {
          const servicio = servicios.find((s: any) => s.nombre === c.servicio);
          if (servicio) total += servicio.precio;
        });
        this.ingresos = total;
        this.cargando = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.cargando = false;
        this.errorCarga = true;
        this.cd.markForCheck();
      }
    });
  }
}