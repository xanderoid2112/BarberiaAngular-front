import { Component, OnInit } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html'
})
export class Login implements OnInit { 
  credenciales = { email: '', password: '' };
  errorMessage = '';
  returnUrl: string = '/home'; // Variable para guardar la ruta de destino

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  ingresar() {
    this.authService.login(this.credenciales).subscribe({
      next: (user) => {
        localStorage.setItem('usuario', JSON.stringify(user));
        
        // 1. Si es Administrador, lo enviamos a su panel principal
        if (user.rol === 'ADMIN') {
          this.router.navigate(['/gestion-productos']).then(() => {
            window.location.reload();
          });
        } 
        // 2. Si es Barbero, lo enviamos a su gestor de citas
        else if (user.rol === 'BARBERO') {
          this.router.navigate(['/gestion-citas']).then(() => {
            window.location.reload();
          });
        } 
        // 3. Si es un Cliente, lo devolvemos a donde estaba (o al Home)
        else {
          this.router.navigate([this.returnUrl]).then(() => {
            window.location.reload();
          });
        }
      },
      error: () => this.errorMessage = 'Credenciales incorrectas'
    });
  }
}