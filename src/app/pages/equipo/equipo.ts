import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './equipo.html',
  styleUrls: ['./equipo.css'],
  encapsulation: ViewEncapsulation.None
})
export class Equipo implements OnInit {
  barberosLista = signal<any[]>([]);
  isLoggedIn: boolean = false; // <-- Nueva variable

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Verificar si está logeado
    this.isLoggedIn = !!localStorage.getItem('usuario');

    this.http.get('http://localhost:8080/api/barberos').subscribe({
      next: (data: any) => this.barberosLista.set(data),
      error: (err) => console.error("Error:", err)
    });
  }
}