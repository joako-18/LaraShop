import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  errorMsg: string = '';
  cargando: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ingresar(): void {
    this.errorMsg = '';

    if (!this.correo || !this.contrasena) {
      this.errorMsg = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    this.cargando = true;

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (res) => {
        this.cargando = false;
        const destino = res.rol === 'administrador' ? '/admin' : '/dashboard';
        this.router.navigateByUrl(destino);
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 401) {
          this.errorMsg = 'Correo o contraseña incorrectos.';
        } else {
          this.errorMsg = 'Error al conectar con el servidor.';
        }
      }
    });
  }
}