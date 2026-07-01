import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- NECESARIO PARA LOS INPUTS DEL MODAL

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mis-citas.html',
  styleUrls: ['./mis-citas.css'],
  encapsulation: ViewEncapsulation.None
})
export class MisCitas implements OnInit {
  citasLista = signal<any[]>([]);
  usuarioId: number | null = null;

  // --- SIGNALS PARA EL MODAL DE VER PRODUCTOS ---
  productosCita = signal<any[]>([]);
  mostrarModal = signal<boolean>(false);
  citaSeleccionadaId = signal<number | null>(null);

  // --- NUEVAS SIGNALS PARA EL MODAL DE EDITAR ---
  mostrarModalEditar = signal<boolean>(false);
  citaAEditar = signal<any>(null);
  horariosDisponibles = signal<string[]>([]);
  productosAEditar = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.usuarioId = usuario.id;
      this.cargarMisCitas();
    }
  }

  cargarMisCitas() {
    this.http.get(`http://localhost:8080/api/reservas/mis-citas/${this.usuarioId}`).subscribe({
      next: (data: any) => this.citasLista.set(data),
      error: (err) => console.error("Error al cargar las citas:", err)
    });
  }

  // --- FUNCIONES DE CANCELAR ---
  cancelarCita(id: number) {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.')) {
      this.http.put(`http://localhost:8080/api/reservas/${id}/estado`, { estado: 'CANCELADA' }).subscribe({
        next: () => this.cargarMisCitas(),
        error: () => alert("Hubo un error al cancelar la cita.")
      });
    }
  }

  // --- FUNCIONES DE VER PRODUCTOS ---
  verProductos(reservaId: number) {
    this.citaSeleccionadaId.set(reservaId);
    this.http.get(`http://localhost:8080/api/reservas/${reservaId}/productos`).subscribe({
      next: (data: any) => {
        this.productosCita.set(data);
        this.mostrarModal.set(true);
      }
    });
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.productosCita.set([]);
  }

  // --- NUEVAS FUNCIONES DE EDITAR ---
  abrirModalEditar(cita: any) {
    // Clonamos la cita para no afectar la tabla hasta que se guarde
    this.citaAEditar.set({ ...cita }); 
    this.horariosDisponibles.set(cita.barbero?.horarios || []);

    // Traemos los productos de esta cita para poder editar sus cantidades
    this.http.get(`http://localhost:8080/api/reservas/${cita.id}/productos`).subscribe({
      next: (data: any) => {
        // Creamos una copia de la cantidad para modificarla en el input
        const prods = data.map((p: any) => ({ ...p, nuevaCantidad: p.cantidad }));
        this.productosAEditar.set(prods);
        this.mostrarModalEditar.set(true);
      }
    });
  }

  cerrarModalEditar() {
    this.mostrarModalEditar.set(false);
    this.citaAEditar.set(null);
    this.productosAEditar.set([]);
  }

  guardarEdicion() {
    const cita = this.citaAEditar();
    
    // Armamos el paquete de datos para enviar a Spring Boot
    const payload = {
      hora: cita.hora,
      productos: this.productosAEditar().map(p => ({ id: p.id, cantidad: p.nuevaCantidad }))
    };

    this.http.put(`http://localhost:8080/api/reservas/${cita.id}/modificar`, payload).subscribe({
      next: () => {
        alert("Cita modificada con éxito.");
        this.cerrarModalEditar();
        this.cargarMisCitas(); // Recargamos la tabla para ver los cambios
      },
      error: () => alert("Error al guardar los cambios.")
    });
  }
}