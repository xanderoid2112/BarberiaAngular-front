import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importante para usar [(ngModel)]
  templateUrl: './dashboard-cliente.html',
  styleUrls: ['./dashboard-cliente.css']
})
export class DashboardCliente implements OnInit {
  usuario: any = {
    id: null,
    nombre: '',
    telefono: '',
    email: '',
    password: ''
  };
  
  mensaje: string = '';
  tipoMensaje: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // 1. Obtener el usuario guardado en el login
    const usuarioLocal = localStorage.getItem('usuario');
    if (usuarioLocal) {
      const userParsed = JSON.parse(usuarioLocal);
      this.usuario.id = userParsed.id;
      // 2. Traer los datos frescos de la base de datos
      this.obtenerDatosDesdeBD();
    }
  }

  obtenerDatosDesdeBD() {
    this.http.get(`http://localhost:8080/api/usuarios/${this.usuario.id}`).subscribe({
      next: (data: any) => {
        this.usuario = data;
        // Limpiamos la contraseña encriptada para que no se muestre en el input
        this.usuario.password = ''; 
      },
      error: (err) => console.error("Error al obtener los datos", err)
    });
  }

  guardarCambios() {
    this.http.put(`http://localhost:8080/api/usuarios/${this.usuario.id}`, this.usuario).subscribe({
      next: (res: any) => {
        this.mensaje = 'Datos actualizados correctamente en la base de datos';
        this.tipoMensaje = 'success';
        // Actualizamos el localStorage con los nuevos datos
        localStorage.setItem('usuario', JSON.stringify(res));
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err) => {
        this.mensaje = 'Error al actualizar los datos';
        this.tipoMensaje = 'error';
        console.error("Error al actualizar", err);
      }
    });
  }
}