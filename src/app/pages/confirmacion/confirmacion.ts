import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 1. Importamos la herramienta de rutas

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './confirmacion.html',
  styleUrls: ['./confirmacion.css'],
  encapsulation: ViewEncapsulation.None
})
export class Confirmacion {}