import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { guestGuard } from './core/guards/guest-guard';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth-guard';
import { Accueil } from './features/pages/accueil/accueil';

export const routes: Routes = [
    {
        path: 'accueil',
        component: Accueil,
        canActivate: [guestGuard]
    },
    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'register',
        component: Register,
        canActivate: [guestGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./features/pages/dashboard/dashboard')
                .then(d => d.Dashboard),
        canActivate: [authGuard]
    },
    {   path: '',
        redirectTo: 'accueil',
        pathMatch: 'full'
    },
    {   path: '**',
        redirectTo: 'accueil'
    }
];
