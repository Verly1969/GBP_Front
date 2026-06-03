import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Footer } from '../../../shared/components/footer/footer';
import { AuthService } from '../../../core/services/auth.service';
import { ScrollService } from '../../../core/services/scroll.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    Footer
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {

  private readonly authService  = inject(AuthService);
  private readonly scrollService = inject(ScrollService);

  // Récupérer l'utilisateur connecté depuis le signal
  currentUser = this.authService.currentUser;

  // Afficher ou non la scrollBar
  ngOnInit(): void    { this.scrollService.hide(); }
  ngOnDestroy(): void { this.scrollService.show(); }

}
