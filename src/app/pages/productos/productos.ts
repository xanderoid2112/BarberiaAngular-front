import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- NUEVO: Necesario para los filtros

interface ItemCarrito {
  producto: any;
  cantidad: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,

  imports: [CommonModule, RouterLink, FormsModule], // <-- Inyectamos FormsModule
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  encapsulation: ViewEncapsulation.None
})
export class Productos implements OnInit {
  productosLista = signal<any[]>([]);
  productosOriginales: any[] = []; // <-- NUEVO: Backup para el filtro
  
  carrito = signal<ItemCarrito[]>([]);

  barberiaNombre: string = '';
  barberoNombre: string = '';
  horarioSeleccionado: string = '';
  barberiaId: number = 0; 
  barberoId: number = 0;
  fechaSeleccionada: string = '';

  // --- VARIABLES DE FILTRO ---
  textoBusqueda: string = '';
  filtrosCategorias = { capilares: false, tintes: false, herramientas: false, accesorios: false };
  precioMaximo: number = 250;
  filtrosDisponibilidad = { enStock: false, agotado: false };

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const barberiaId = params['barberiaId'];
      this.barberiaNombre = params['barberiaNombre'] || 'Cargando...';
      this.barberoNombre = params['barberoNombre'] || 'Cargando...';
      this.horarioSeleccionado = params['horario'] || 'Sin asignar';
this.fechaSeleccionada = params['fecha'] || '';
      const url = barberiaId ? `http://localhost:8080/api/productos/barberia/${barberiaId}` : 'http://localhost:8080/api/productos';

      this.http.get(url).subscribe({
        next: (data: any) => {
          this.productosOriginales = data; // Guardamos el backup
          this.productosLista.set(data);   // Pintamos los productos
          this.barberiaId = params['barberiaId'];
          this.barberoId = params['barberoId'];
        },
        error: (err) => console.error("Error al cargar productos:", err)
      });
    });
  }

  // --- LÓGICA DE FILTRADO ---
  aplicarFiltro() {
    let resultado = this.productosOriginales;

    // 1. Filtro por Búsqueda (nombre o descripción)
    if (this.textoBusqueda.trim() !== '') {
      const texto = this.textoBusqueda.toLowerCase();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(texto) || 
        (p.descripcion && p.descripcion.toLowerCase().includes(texto))
      );
    }

    // 2. Filtro por Categorías
    const categoriasActivas = Object.keys(this.filtrosCategorias).filter(key => (this.filtrosCategorias as any)[key]);
    if (categoriasActivas.length > 0) {
      resultado = resultado.filter(p => {
        if (!p.categoria) return false;
        const catProd = p.categoria.toLowerCase();
        return categoriasActivas.some(cat => catProd.includes(cat));
      });
    }

    // 3. Filtro por Rango de Precio
    resultado = resultado.filter(p => p.precio <= this.precioMaximo);

    // 4. Filtro por Disponibilidad
    if (this.filtrosDisponibilidad.enStock && !this.filtrosDisponibilidad.agotado) {
      resultado = resultado.filter(p => p.stock > 0);
    } else if (this.filtrosDisponibilidad.agotado && !this.filtrosDisponibilidad.enStock) {
      resultado = resultado.filter(p => p.stock === 0);
    }

    // Actualizamos la vista
    this.productosLista.set(resultado);
  }

  limpiarFiltros() {
    this.textoBusqueda = '';
    this.filtrosCategorias = { capilares: false, tintes: false, herramientas: false, accesorios: false };
    this.precioMaximo = 500; // Lo regresamos al tope máximo
    this.filtrosDisponibilidad = { enStock: false, agotado: false };
    this.productosLista.set(this.productosOriginales);
  }

  // --- LÓGICA DEL CARRITO (Se mantiene igual) ---
  agregarAlCarrito(producto: any) {
    this.carrito.update(items => {
      const itemExiste = items.find(item => item.producto.id === producto.id);
      if (itemExiste) {
        if (itemExiste.cantidad < producto.stock) {
          return items.map(item => item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
        }
        return items;
      } else {
        return [...items, { producto, cantidad: 1 }];
      }
    });
  }

  reducirCantidad(productoId: number) {
    this.carrito.update(items => {
      const itemExiste = items.find(item => item.producto.id === productoId);
      if (itemExiste && itemExiste.cantidad > 1) {
        return items.map(item => item.producto.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item);
      } else {
        return items.filter(item => item.producto.id !== productoId);
      }
    });
  }

  irAConfirmacion() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito()));
    this.router.navigate(['/confirmacion'], {
    queryParams: {
      barberiaId: this.barberiaId,
      barberoId: this.barberoId,
      barberiaNombre: this.barberiaNombre,
      barberoNombre: this.barberoNombre,
      horario: this.horarioSeleccionado,
      fecha: this.fechaSeleccionada
    }
    });
  }
  // --- FUNCIONES PARA LAS ETIQUETAS DINÁMICAS ---
  obtenerCategoriasComoLista(categoriasStr: string): string[] {
    if (!categoriasStr) return [];
    return categoriasStr.split(',').map(c => c.trim());
  }

  obtenerClaseCategoria(categoria: string): string {
    const catLimpia = categoria.toLowerCase().replace(' ', ''); 
    return 'tag-' + catLimpia;
  }
}