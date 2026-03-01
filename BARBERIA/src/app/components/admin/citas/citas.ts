import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberosServices } from '../../../services/barbero';

@Component({
  selector: 'app-admin-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citas.html',
})
export class AdminCitas implements OnInit {

  citas:    any[] = [];
  cargando        = true;

  constructor(private api: BarberosServices, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.cargando = true;
    this.api.getCitas().subscribe({
      next: (res) => {
        this.citas    = res;
        this.cargando = false;
        this.cd.detectChanges(); // ✅
      },
      error: () => {
        this.cargando = false;
        this.cd.detectChanges(); // ✅
      }
    });
  }

  cancelarCita(id: number) {
    if (!confirm('¿Cancelar esta cita?')) return;
    this.api.deleteCita(id).subscribe(() => this.cargarCitas());
  }
}