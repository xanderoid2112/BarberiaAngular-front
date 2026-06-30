import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-empleados',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './gestion-empleados.html',
  styleUrls: ['./admin-forms.css'],
  encapsulation: ViewEncapsulation.None
})
export class GestionEmpleados implements OnInit {
  empleadosLista = signal<any[]>([]);
  barberiaId: number | null = null;

  // Molde para capturar los datos de la vista
  empleadoActual: any = {
    nombre: '', email: '', telefono: '', password: '', 
    especialidad: '', descripcion: '', horariosTexto: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);

      if (usuario.rol !== 'ADMIN') {
         alert('Acceso denegado. Solo administradores.');
         this.router.navigate(['/home']);
         return;
      }
      this.barberiaId = usuario.barberia?.id || 1; 
      this.cargarEmpleados();
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarEmpleados() {
    this.http.get<any[]>(`http://localhost:8080/api/barberos/barberia/${this.barberiaId}`).subscribe({
      next: (data) => this.empleadosLista.set(data),
      error: (err) => console.error('Error al cargar empleados:', err)
    });
  }

  guardarEmpleado() {
    if (!this.empleadoActual.nombre || !this.empleadoActual.email || !this.empleadoActual.password) {
      alert('Nombre, Email y Contraseña son obligatorios.');
      return;
    }

    // Convertimos el texto de los horarios "10:00 AM, 11:00 AM" a un arreglo/lista
    const horariosArray = this.empleadoActual.horariosTexto
      ? this.empleadoActual.horariosTexto.split(',').map((h: string) => h.trim())
      : [];

    const payload = {
      nombre: this.empleadoActual.nombre,
      email: this.empleadoActual.email,
      telefono: this.empleadoActual.telefono,
      password: this.empleadoActual.password,
      especialidad: this.empleadoActual.especialidad,
      descripcion: this.empleadoActual.descripcion,
      horarios: horariosArray
    };

    this.http.post(`http://localhost:8080/api/barberos/barberia/${this.barberiaId}`, payload).subscribe({
      next: () => {
        this.cargarEmpleados();
        this.limpiarFormulario();
        alert('Empleado registrado y cuenta creada con éxito.');
      },
      error: (err) => {
        console.error(err);
        alert('Hubo un error al guardar. Asegúrate de que el email no esté ya registrado.');
      }
    });
  }

  eliminarEmpleado(id: number) {
    if (confirm('¿Eliminar perfil de este barbero?')) {
      this.http.delete(`http://localhost:8080/api/barberos/${id}`).subscribe({
        next: () => this.cargarEmpleados(),
        error: () => alert('No se puede eliminar porque tiene citas asociadas.')
      });
    }
  }

  limpiarFormulario() {
    this.empleadoActual = {
      nombre: '', email: '', telefono: '', password: '', 
      especialidad: '', descripcion: '', horariosTexto: ''
    };
  }
}