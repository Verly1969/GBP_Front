import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router      = inject(Router);
  
  // Récupérer les rôles autorisés depuis les données de la route
  const allowedRoles: string[] = route.data['roles'] ?? [];
  const userRole = authService.currentUser()?.role;

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
