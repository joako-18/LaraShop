import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) {}

  onLogout() {
    console.log('Cerrando sesión...');
    // Aquí iría tu lógica de autenticación
  }

  navigateTo(url: string, extras?: any) {
    this.router.navigateByUrl(url, extras);
  }
}
