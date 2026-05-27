import { Component, inject } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Footer } from '../../../shared/components/footer/footer';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    Header,
    Footer
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private readonly authService = inject(AuthService);

  // Récupérer l'utilisateur connecté depuis le signal
  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
