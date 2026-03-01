import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BarberosServices, Barbero, Servicio } from '../../services/barbero';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  barberos:  Barbero[]  = [];
  servicios: Servicio[] = [];
  constructor(private api: BarberosServices) {}
  ngOnInit() {
    this.api.getBarberos().subscribe(res  => this.barberos  = res);
    this.api.getServicios().subscribe(res => this.servicios = res);
  }
}