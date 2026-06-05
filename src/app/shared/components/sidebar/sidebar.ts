import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  readonly authService    = inject(AuthService);
  readonly sidebarService = inject(SidebarService);

  // Gérer l'ouverture/ fermeture des sous-menus
  openMenus = signal<string[]>([]);

  toggleMenu(label: string): void {
    this.openMenus.update(menus =>
      menus.includes(label)
        ? menus.filter(m => m !== label) // fermer
        : [label] // ouvrir
    );
  }

  isMenuOpen(label: string): boolean {
    return this.openMenus().includes(label);
  }
}
