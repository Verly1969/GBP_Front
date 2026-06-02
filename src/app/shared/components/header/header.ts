import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);

  // signal partagé depuis AuthService
  isLoggedIn = this.authService.isLoggedIn;

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
  }

  returnAccueil(): void {
    this.router.navigate(['./accueil']);
  }

}
