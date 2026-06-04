import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login')
                .then(l => l.Login),
        canActivate: [guestGuard]
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/register/register')
                .then(r => r.Register)
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./shared/dashboard/dashboard')
                .then(d => d.Dashboard),
        canActivate: [authGuard]
    },
    {   path: '',
        loadComponent: () =>
            import('./features/pages/accueil/accueil')
                .then(a => a.Accueil),
        pathMatch: 'full'
    },
    {   path: '**',
        loadComponent: () =>
            import('./features/pages/accueil/accueil')
                .then(a => a.Accueil)
    }
];
