import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Verificamos si existe un usuario en el almacenamiento local
    // (Asegúrate de que tu Login guarde algo en el localStorage al ingresar)
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    // Si hay un usuario o token guardado, está logeado
    this.isLoggedIn = !!localStorage.getItem('usuario'); 
  }

  cerrarSesion() {
    // Limpiamos el almacenamiento y redirigimos
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.router.navigate(['/home']).then(() => {
      window.location.reload(); // Recarga rápida para limpiar el estado
    });
  }
}