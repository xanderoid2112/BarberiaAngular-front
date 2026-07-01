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
  citasLista = signal<any[]>([]);
  barberoId: number | null = null;
  
  // Variables para las estadísticas
  totalCitas = signal<number>(0);
  pendientes = signal<number>(0);
  completadas = signal<number>(0);

  // --- SIGNALS PARA EL MODAL DE PRODUCTOS ---
  productosCita = signal<any[]>([]);
  mostrarModal = signal<boolean>(false);
  citaSeleccionadaId = signal<number | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      
      this.http.get<any>(`http://localhost:8080/api/barberos/usuario/${usuario.id}`).subscribe({
        next: (barbero) => {
          if (barbero && barbero.id) {
            this.barberoId = barbero.id;
            this.cargarCitas(); 
          } else {
            console.warn("Esta cuenta de usuario no tiene un perfil de barbero en la base de datos.");
          }
        },
        error: (err) => console.error("Error al buscar el perfil del barbero:", err)
      });
    }
  }

  cargarCitas() {
    if (!this.barberoId) return;

    this.http.get<any[]>(`http://localhost:8080/api/reservas/barbero/${this.barberoId}`).subscribe({
      next: (data) => {
        let citasOrdenadas = data.sort((a, b) => {
          const fechaA = new Date(`${a.fecha} ${a.hora}`).getTime();
          const fechaB = new Date(`${b.fecha} ${b.hora}`).getTime();
          return fechaA - fechaB;
        });

        // Ya no iteramos los productos aquí, Angular dibujará la tabla de inmediato
        this.citasLista.set(citasOrdenadas);
        this.calcularEstadisticas(citasOrdenadas);
      },
      error: (err) => console.error("Error al cargar las citas:", err)
    });
  }

  calcularEstadisticas(citas: any[]) {
    this.totalCitas.set(citas.length);
    this.pendientes.set(citas.filter(c => c.estado === 'PENDIENTE' || c.estado === 'EN_EJECUCION').length);
    this.completadas.set(citas.filter(c => c.estado === 'TERMINADO').length);
  }

  cambiarEstado(citaId: number, nuevoEstado: string) {
    this.http.put(`http://localhost:8080/api/reservas/${citaId}/estado`, { estado: nuevoEstado }).subscribe({
      next: () => this.cargarCitas(),
      error: (err) => {
        console.error("Error al cambiar estado:", err);
        alert("Hubo un problema al actualizar el estado.");
      }
    });
  }

  // --- FUNCIONES DEL MODAL ---
  verProductos(reservaId: number) {
    this.citaSeleccionadaId.set(reservaId);
    this.http.get(`http://localhost:8080/api/reservas/${reservaId}/productos`).subscribe({
      next: (data: any) => {
        this.productosCita.set(data);
        this.mostrarModal.set(true); 
      },
      error: (err) => console.error("Error al cargar productos de la cita:", err)
    });
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.productosCita.set([]);
  }
}