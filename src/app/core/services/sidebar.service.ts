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
      route: '/app/dashboard',
      roles: ['Admin', 'User']
    },
    {
      label: 'Mon compte',
      icon: '👱',
      route: '',
      roles: ['Admin', 'User'],
      children: [
        {
          label: 'Profil',
          icon: '✒️',
          route: '/app/profil',
          roles: ['Admin', 'User']
        },
        {
          label: 'Email',
          icon: '📧',
          route: '/app/email',
          roles: ['Admin', 'User']
        },
        {
          label: 'Mot de passe',
          icon: '🗝️',
          route: '/app/password',
          roles: ['Admin', 'User']
        }
      ]
    },
    {
      label: 'Comptes',
      icon: '💰',
      route: '/app/account',
      roles: ['Admin', 'User']
    },
    {
      label: 'Crédits',
      icon: '💳',
      route: '/app/credit',
      roles: ['Admin', 'User']
    },
    {
      label: 'Opérations',
      icon: '🛒',
      route: '/app/operations',
      roles: ['Admin', 'User']
    },
    
    // Uniquement l'Admin
    {
      label: 'Utilisateurs',
      icon: '👯',
      route: '/app/admin/users',
      roles: ['Admin']
    },
    {
      label: 'Réglages',
      icon: '⚙️',
      route: '',
      roles: ['Admin'],
      children: [
        {
          label: 'Catégorie',
          icon: '📚',
          route: '/app/admin/category',
          roles: ['Admin']
        },
        {
          label: 'Types comptes',
          icon: '💸',
          route: '/app/admin/account-types',
          roles: ['Admin']
        },
        {
          label: 'Types crédits',
          icon: '💸',
          route: '/app/admin/credit-types',
          roles: ['Admin']
        }
      ]
    }
  ]

  // filtre selon le rôle de l'utilisateur
  readonly navItems = computed(() => {

    const role = this.authService.currentUser()?.role;

    if (!role) return [];

    return this.allNavItems.filter(r => r.roles.includes(role));
  })
}
