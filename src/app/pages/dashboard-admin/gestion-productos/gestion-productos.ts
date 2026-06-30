import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE PARA LOS FORMULARIOS

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './gestion-productos.html',
  styleUrls: ['./admin-forms.css'], // Asegúrate de que este archivo css exista
  encapsulation: ViewEncapsulation.None
})
export class GestionProductos implements OnInit {
  productosLista = signal<any[]>([]);
  barberiaId: number | null = null;

  // Objeto en blanco para el formulario
  productoActual: any = {
    id: null,
    nombre: '',
    precio: null,
    stock: null,
    categoria: 'Cera',
    descripcion: '',
    imagen: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);

      // 1. RESTRICCIÓN DE ROL
      if (usuario.rol !== 'ADMIN') {
         alert('Acceso denegado. Solo administradores.');
         this.router.navigate(['/home']);
         return;
      }

      this.barberiaId = usuario.barberia?.id || 1;

      this.cargarProductos();
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarProductos() {
    this.http.get<any[]>(`http://localhost:8080/api/productos/barberia/${this.barberiaId}`).subscribe({
      next: (data) => this.productosLista.set(data),
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  guardarProducto() {
    if (!this.productoActual.nombre || !this.productoActual.precio || this.productoActual.stock === null) {
      alert('Por favor completa los campos obligatorios (Nombre, Precio y Stock).');
      return;
    }

    // Le inyectamos el ID de la barbería al producto antes de enviarlo al backend
    const payload = {
      ...this.productoActual,
      barberia: { id: this.barberiaId }
    };

    if (this.productoActual.id) {
      // Si ya tiene ID, es una ACTUALIZACIÓN (PUT)
      this.http.put(`http://localhost:8080/api/productos/${this.productoActual.id}`, payload).subscribe({
        next: () => {
          this.cargarProductos();
          this.limpiarFormulario();
        }
      });
    } else {
      // Si no tiene ID, es un producto NUEVO (POST)
      this.http.post('http://localhost:8080/api/productos', payload).subscribe({
        next: () => {
          this.cargarProductos();
          this.limpiarFormulario();
        }
      });
    }
  }

  editarProducto(prod: any) {
    // Clonamos el producto seleccionado y lo pasamos al formulario de arriba
    this.productoActual = { ...prod };
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla al formulario
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
      this.http.delete(`http://localhost:8080/api/productos/${id}`).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => alert('No se puede eliminar el producto porque ya está asociado a citas pasadas.')
      });
    }
  }

  limpiarFormulario() {
    this.productoActual = {
      id: null, nombre: '', precio: null, stock: null, categoria: 'Cera', descripcion: ''
    };
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // FileReader lee el archivo de la computadora del usuario
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Cuando termina de leer, guarda el código Base64 en nuestro objeto
        this.productoActual.imagen = e.target.result; 
      };
      reader.readAsDataURL(file);
    }}
}