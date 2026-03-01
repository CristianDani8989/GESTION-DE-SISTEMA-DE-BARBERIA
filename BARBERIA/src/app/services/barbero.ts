import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

export interface Barbero {
  id?: number;
  nombre: string;
  especialidad: string;
}

export interface Servicio {
  id?: number;
  nombre: string;
  precio: number;
}

export interface Cita {
  id?: number;
  id_barbero: number;
  id_servicio: number;
  cliente: string;
  fecha: string;
  hora: string;
}

// ✅ Cambia esta URL por la de tu backend en producción (Render, Railway, etc.)
const BASE = 'http://localhost:3000/api';
const TIMEOUT_MS = 12000; // 12 segundos — si el backend no responde, falla rápido

@Injectable({ providedIn: 'root' })
export class BarberosServices {

  constructor(private http: HttpClient) {}

  // ─── Barberos ─────────────────────────────────────────────
  getBarberos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${BASE}/barberos`).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }

  addBarbero(barbero: Barbero): Observable<Barbero> {
    return this.http.post<Barbero>(`${BASE}/barberos`, barbero).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }

  deleteBarbero(id: number): Observable<any> {
    return this.http.delete(`${BASE}/barberos/${id}`).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }

  // ─── Servicios ────────────────────────────────────────────
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${BASE}/servicios`).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }

  addServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(`${BASE}/servicios`, servicio).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }

  updateServicio(id: number, servicio: Servicio): Observable<any> {
    return this.http.put(`${BASE}/servicios/${id}`, servicio).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete(`${BASE}/servicios/${id}`).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }

  // ─── Citas ────────────────────────────────────────────────
  getCitas(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/citas`).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }

  addCita(cita: Cita): Observable<any> {
    return this.http.post<any>(`${BASE}/citas`, cita).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }

  deleteCita(id: number): Observable<any> {
    return this.http.delete(`${BASE}/citas/${id}`).pipe(
      timeout(TIMEOUT_MS),
      catchError(err => throwError(() => err))
    );
  }
}