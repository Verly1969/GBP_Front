import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarService } from '../../../core/services/sidebar.service';
import { filter } from 'rxjs';

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
export class Sidebar implements OnInit {

  readonly router = inject(Router);
  readonly authService    = inject(AuthService);
  readonly sidebarService = inject(SidebarService);

  // Gérer l'ouverture/ fermeture des sous-menus
  openMenus = signal<string[]>([]);

  ngOnInit(): void {
    // Au démarrage, ouvrir le menu si on est déjà sur un sous-menu
    this.syncOpenMenusFromUrl(this.router.url);

    // A chaque navigation, vérifier si la route est active
    // appartient à un sous-menu -> garder ce menu ouvert
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        
        const url = event.urlAfterRedirects;

        // vérifier si l'url correspond à un enfant
        const matchingLabels = this.sidebarService.navItems()
          .filter(item => {
            if (!item.children) return false;

            return item.children.some(child => url.startsWith(child.route));
          })
          .map(item => item.label);

        if (matchingLabels.length > 0) {
          // on est sur un enfant, garder le menu ouvert
          this.openMenus.set(matchingLabels);
        } else {
          this.openMenus.set([]);
        }
      })

  }
  
  private syncOpenMenusFromUrl(url: string): void {

    const openLabels = this.sidebarService.navItems()
      .filter(item => {
        if (!item.children) return false; // si pas d'enfant, ignorer
        return item.children.some(child => url.startsWith(child.route));

      })
      .map(item => item.label);

    console.log('openLabels: ', openLabels);
    this.openMenus.set(openLabels);
  }

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
