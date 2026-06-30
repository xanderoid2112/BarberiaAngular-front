import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './equipo.html',
  styleUrls: ['./equipo.css'],
  encapsulation: ViewEncapsulation.None
})
export class Equipo implements OnInit {
  barberosLista = signal<any[]>([]);
  isLoggedIn: boolean = false; 
  
  // --- NUEVAS VARIABLES PARA EL CALENDARIO ---
  fechaSeleccionada: string = '';
  fechaMinima: string = ''; // Para bloquear fechas en el pasado
  horariosDisponiblesPorBarbero: { [barberoId: number]: string[] } = {};
  horariosSeleccionados: { [barberoId: number]: string } = {};
  
  barberiaIdActual: number | null = null;
  barberiaNombreActual: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('usuario');

    // Bloqueamos las fechas pasadas calculando la fecha de hoy
    const hoy = new Date();
    // Ajuste por zona horaria para evitar desfases
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    this.fechaMinima = hoy.toISOString().split('T')[0];

    this.route.queryParams.subscribe(params => {
      this.barberiaIdActual = params['barberiaId'];
      this.barberiaNombreActual = params['barberiaNombre']; 

      if (this.barberiaIdActual) {
        this.http.get(`http://localhost:8080/api/barberos/barberia/${this.barberiaIdActual}`).subscribe({
          next: (data: any) => this.barberosLista.set(data)
        });
      }
    });
  }

  // --- FUNCIÓN QUE SE EJECUTA AL CAMBIAR LA FECHA EN EL CALENDARIO ---
  onFechaChange() {
    if (!this.fechaSeleccionada) return;

    this.barberosLista().forEach(barbero => {
      // Preguntamos a tu nuevo endpoint qué horas están libres para este día
      this.http.get<string[]>(`http://localhost:8080/api/reservas/disponibles?barberoId=${barbero.id}&fecha=${this.fechaSeleccionada}`)
        .subscribe({
          next: (horasLibres) => {
            this.horariosDisponiblesPorBarbero[barbero.id] = horasLibres;
            this.horariosSeleccionados[barbero.id] = ''; // Limpiamos la hora anterior si cambia de día
          }
        });
    });
  }

  seleccionarHorario(barberoId: number, horario: string) {
    this.horariosSeleccionados[barberoId] = horario;
  }
}