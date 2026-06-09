import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core'; // 1. Importamos signal
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-barberias',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './barberias.html',
  styleUrls: ['./barberias.css'],
  encapsulation: ViewEncapsulation.None
})
export class Barberias implements OnInit {
  // 2. Definimos la lista como un signal inicializado en vacío []
  barberiasLista = signal<any[]>([]); 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:8080/api/barberias').subscribe({
      next: (data: any) => {
        // 3. Guardamos los datos usando .set() para activar la señal
        this.barberiasLista.set(data); 
      },
      error: (err) => {
        console.error("Error al cargar barberías:", err);
      }
    });
  }
}