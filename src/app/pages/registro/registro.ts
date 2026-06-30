import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html'
})
export class Registro {
  usuario = {
    nombre: '',
    email: '',
    telefono: '', 
    password: '',
    rol: 'CLIENTE'
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrar() {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.registrarUsuario(this.usuario).subscribe({
      next: (res) => {
        this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al registrar el usuario. El correo podría ya estar en uso.';
      }
    });
  }
}