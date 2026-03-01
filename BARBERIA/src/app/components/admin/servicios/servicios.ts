import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberosServices, Servicio } from '../../../services/barbero';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.html',
})
export class AdminServicios implements OnInit {

  servicios: Servicio[]  = [];
  nombre                 = '';
  precio: number | null  = null;
  cargando               = true;

  constructor(private api: BarberosServices, private cd: ChangeDetectorRef) {}

  ngOnInit() { this.cargarServicios(); }

  cargarServicios() {
    this.cargando = true;
    this.api.getServicios().subscribe({
      next: (res) => {
        this.servicios = res;
        this.cargando  = false;
        this.cd.detectChanges(); // ✅
      },
      error: () => {
        this.cargando = false;
        this.cd.detectChanges(); // ✅
      }
    });
  }

  agregarServicio() {
    if (!this.nombre || this.precio === null) { alert('Completa todos los campos'); return; }
    this.api.addServicio({ nombre: this.nombre, precio: this.precio }).subscribe(() => {
      this.nombre = ''; this.precio = null;
      this.cargarServicios();
    });
  }

  editarPrecio(servicio: Servicio) {
    const nuevo = prompt(`Nuevo precio para ${servicio.nombre}`, servicio.precio.toString());
    if (nuevo !== null) {
      this.api.updateServicio(servicio.id!, { ...servicio, precio: parseFloat(nuevo) })
        .subscribe(() => this.cargarServicios());
    }
  }

  eliminarServicio(id: number) {
    if (!confirm('¿Eliminar este servicio?')) return;
    this.api.deleteServicio(id).subscribe(() => this.cargarServicios());
  }
}