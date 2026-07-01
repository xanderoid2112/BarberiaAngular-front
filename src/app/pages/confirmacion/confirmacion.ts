import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './confirmacion.html',
  styleUrls: ['./confirmacion.css'],
  encapsulation: ViewEncapsulation.None
})
export class Confirmacion implements OnInit {
  usuario: any = {};
  barberiaId: number = 0;
  barberoId: number = 0;
  barberiaNombre: string = '';
  barberoNombre: string = '';
  horarioSeleccionado: string = '';
  fechaSeleccionada: string = ''; // <-- 1. NUEVA VARIABLE PARA LA FECHA
  carrito: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.barberiaId = params['barberiaId'];
      this.barberoId = params['barberoId'];
      this.barberiaNombre = params['barberiaNombre'] || 'No especificado';
      this.barberoNombre = params['barberoNombre'] || 'No especificado';
      this.horarioSeleccionado = params['horario'] || 'No especificado';
      this.fechaSeleccionada = params['fecha'] || ''; // <-- 2. CAPTURAMOS LA FECHA DE LA URL
    });

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) this.usuario = JSON.parse(usuarioGuardado);

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) this.carrito = JSON.parse(carritoGuardado);
  }

  confirmarReserva() {
    const payload = {
      usuarioId: this.usuario.id,
      barberiaId: Number(this.barberiaId), 
      barberoId: Number(this.barberoId),  
      horario: this.horarioSeleccionado,
      fecha: this.fechaSeleccionada, // <-- 3. METEMOS LA FECHA EN EL PAQUETE AL BACKEND
      carrito: this.carrito
    };

    console.log('📦 Paquete a punto de enviarse al Backend:', payload);

    if (!payload.usuarioId) {
      alert('Error: No se encontró el ID del usuario. ¿Iniciaste sesión?');
      return; 
    }
    if (!payload.barberiaId || !payload.barberoId || !payload.fecha) {
      alert('Error: Faltan datos (Barbería, Barbero o Fecha). Regresa e inténtalo de nuevo.');
      return;
    }

    this.http.post('http://localhost:8080/api/reservas', payload).subscribe({
      next: (res) => {
        alert('¡Reserva confirmada con éxito!');
        localStorage.removeItem('carrito'); 
        this.router.navigate(['/mis-citas']); 
      },
      error: (err) => {
        console.error("Error al guardar la reserva:", err);
        alert('Hubo un error al confirmar. Revisa la consola.');
      }
    });
  }
}