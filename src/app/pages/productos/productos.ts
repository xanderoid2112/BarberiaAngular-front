import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router'; // 1. Importamos las rutas

@Component({
  selector: 'app-productos',
  standalone: true,
  // 2. Agregamos RouterLink aquí:
  imports: [CommonModule, RouterLink], 
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  encapsulation: ViewEncapsulation.None
})
export class Productos implements OnInit {
  productosLista = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:8080/api/productos').subscribe({
      next: (data: any) => {
        this.productosLista.set(data);
      },
      error: (err) => {
        console.error("Error al cargar productos:", err);
      }
    });
  }
}