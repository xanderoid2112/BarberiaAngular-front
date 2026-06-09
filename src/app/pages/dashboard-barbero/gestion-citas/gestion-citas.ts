import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-citas.html',
  styleUrls: ['./gestion-citas.css'],
  encapsulation: ViewEncapsulation.None
})
export class GestionCitas implements OnInit {
  // Señal para almacenar las citas
  citasLista = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Asumiendo que tendrás una ruta genérica para ver TODAS las reservas
    this.http.get('http://localhost:8080/api/reservas').subscribe({
      next: (data: any) => {
        this.citasLista.set(data);
      },
      error: (err) => {
        console.error("Error al cargar las citas:", err);
      }
    });
  }
}