import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  encapsulation: ViewEncapsulation.None
})
export class Home implements OnInit {
  barberias = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:8080/api/barberias').subscribe({
      next: (data: any) => {
        this.barberias.set(data);
      },
      error: (err) => {
        console.error("Error cargando barberías:", err);
      }
    });
  }
}