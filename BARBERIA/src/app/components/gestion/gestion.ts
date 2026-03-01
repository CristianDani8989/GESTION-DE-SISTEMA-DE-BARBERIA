import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BarberosServices, Barbero, Servicio, Cita } from '../../services/barbero';

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestion.html',
})
export class Gestion implements OnInit {
  barberos:  Barbero[]  = [];
  servicios: Servicio[] = [];
  citas:     any[]      = [];

  cliente    = '';
  idBarbero  = '';
  idServicio = '';
  fecha      = '';
  hora       = '';

  cargando     = true;
  errorCarga   = false;
  enviando     = false;
  mensajeExito = '';

  constructor(private api: BarberosServices, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando   = true;
    this.errorCarga = false;

    forkJoin({
      barberos:  this.api.getBarberos(),
      servicios: this.api.getServicios(),
      citas:     this.api.getCitas()
    }).subscribe({
      next: ({ barberos, servicios, citas }) => {
        this.barberos  = barberos;
        this.servicios = servicios;
        this.citas     = citas;
        this.cargando  = false;
        this.cd.detectChanges(); // ✅
      },
      error: () => {
        this.cargando   = false;
        this.errorCarga = true;
        this.cd.detectChanges(); // ✅
      }
    });
  }

  agendar() {
    if (!this.idBarbero || !this.idServicio || !this.cliente || !this.fecha || !this.hora) {
      alert('Por favor completa todos los campos.');
      return;
    }
    this.enviando = true;
    const nuevaCita: Cita = {
      id_barbero:  Number(this.idBarbero),
      id_servicio: Number(this.idServicio),
      cliente: this.cliente,
      fecha:   this.fecha,
      hora:    this.hora
    };
    this.api.addCita(nuevaCita).subscribe({
      next: () => {
        this.enviando     = false;
        this.mensajeExito = '¡Cita agendada con éxito! 🎉';
        this.cliente = ''; this.idBarbero = ''; this.idServicio = '';
        this.fecha   = ''; this.hora      = '';
        setTimeout(() => { this.mensajeExito = ''; this.cd.detectChanges(); }, 3000);
        this.api.getCitas().subscribe(res => {
          this.citas = res;
          this.cd.detectChanges(); // ✅
        });
      },
      error: () => {
        this.enviando = false;
        this.cd.detectChanges(); // ✅
        alert('Error al guardar la cita. Intenta de nuevo.');
      }
    });
  }
}