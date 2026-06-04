import { Injectable, inject, computed } from '@angular/core';
import { AuthService } from './auth.service';
import { NavItem } from '../models/sidebar.model';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  
  private readonly authService = inject(AuthService);

  private readonly allNavItems: NavItem[] = [

    // Commun à tous les utilisateurs enregistrés
    {
      label: 'Tableau de bord',
      icon: '📊',
      route: '/dashbord',
      roles: ['Admin', 'User']
    },
    {
      label: 'Profil',
      icon: '👱',
      route: '/profil',
      roles: ['Admin', 'User']
    },
    {
      label: 'Comptes',
      icon: '💰',
      route: '/account',
      roles: ['Admin', 'User']
    },
    {
      label: 'Opérations',
      icon: '🛒',
      route: '/operations',
      roles: ['Admin', 'User']
    },
    
    // Uniquement l'Admin
    {
      label: 'Réglages',
      icon: '⚙️',
      route: '/admin/reglages',
      roles: ['Admin']
    }
  ]

  // filtre selon le rôle de l'utilisateur
  readonly navItems = computed(() => {

    const role = this.authService.currentUser()?.role;

    if (!role) return [];

    return this.allNavItems.filter(r => r.roles.includes(role));
  })
}
