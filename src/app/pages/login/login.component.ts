import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  // Navegar usando una URL
  navigateTo(url: string, extras?: any) {
    this.router.navigateByUrl(url, extras);
  }
}
