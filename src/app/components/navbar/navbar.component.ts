import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  nombre: string = '';
  esAdmin: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.nombre = this.authService.getNombre();
    this.esAdmin = this.authService.isAdmin();
  }

  onLogout(): void {
    this.authService.logout();
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }
}