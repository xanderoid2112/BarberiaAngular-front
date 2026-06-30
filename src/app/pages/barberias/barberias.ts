import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE: Necesario para los inputs

@Component({
  selector: 'app-barberias',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // <-- Lo inyectamos aquí
  templateUrl: './barberias.html',
  styleUrls: ['./barberias.css'],
  encapsulation: ViewEncapsulation.None
})
export class Barberias implements OnInit {
  barberiasLista = signal<any[]>([]); // La lista que se pinta en pantalla
  barberiasOriginales: any[] = []; // Guardamos la lista original para no perderla al borrar el filtro

  // Variables para capturar lo que hace el cliente
  textoBusqueda: string = '';
  filtrosCategorias = {
    hombres: false,
    mujeres: false,
    ninos: false,
    express: false,
    premium: false,
    barrio: false
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:8080/api/barberias').subscribe({
      next: (data: any) => {
        this.barberiasOriginales = data; // Guardamos el backup
        this.barberiasLista.set(data);   // Pintamos la tabla
      },
      error: (err) => console.error("Error al cargar barberías:", err)
    });
  }

  // --- LÓGICA DE FILTRADO ---
  aplicarFiltro() {
    let resultado = this.barberiasOriginales;

    // 1. Filtrar por la barra de búsqueda (Busca en nombre y dirección)
    if (this.textoBusqueda.trim() !== '') {
      const texto = this.textoBusqueda.toLowerCase();
      resultado = resultado.filter(b => 
        b.nombre.toLowerCase().includes(texto) || 
        (b.direccion && b.direccion.toLowerCase().includes(texto))
      );
    }

    // 2. Filtrar por los Checkboxes
    // Averiguamos cuáles checks están marcados (en true)
    const categoriasSeleccionadas = Object.keys(this.filtrosCategorias)
      .filter(key => (this.filtrosCategorias as any)[key]);

    if (categoriasSeleccionadas.length > 0) {
      resultado = resultado.filter(b => {
        if (!b.categoria) return false;
        const catBarberia = b.categoria.toLowerCase();
       
        return categoriasSeleccionadas.some(cat => catBarberia.includes(cat));
      });
    }

   
    this.barberiasLista.set(resultado);
  }

  limpiarFiltros() {
    this.textoBusqueda = '';
    this.filtrosCategorias = { hombres: false, mujeres: false, ninos: false, express: false, premium: false, barrio: false };
    this.barberiasLista.set(this.barberiasOriginales); // Restauramos todo
  }
  obtenerCategoriasComoLista(categoriasStr: string): string[] {
    if (!categoriasStr) return [];
    return categoriasStr.split(',').map(c => c.trim());
  }

  obtenerClaseCategoria(categoria: string): string {
    const catLimpia = categoria.toLowerCase()
      .replace('niños', 'ninos') // Evita problemas con la 'ñ'
      .replace(' ', ''); 
    return 'tag-' + catLimpia;
  }
}