import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Importamos el componente Navbar (asegúrate de que el nombre de la clase sea Navbar)
import { Navbar } from './components/navbar/navbar'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Lo agregamos aquí dentro de los corchetes, junto a RouterOutlet
  imports: [RouterOutlet, Navbar], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'barberia-frontend';
}