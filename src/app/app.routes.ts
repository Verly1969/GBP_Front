import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { Home } from './features/home/home';
import { Layout } from './features/pages/layout/layout';
import { Dashboard } from './features/pages/dashboard/dashboard';

export const routes: Routes = [
    {   path: '',
        redirectTo: 'accueil',
        pathMatch: 'full'
    },
    {
        path: 'accueil',
        loadComponent: () =>
            import('./features/home/home')
            .then(h => h.Home)
    },
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
        path: 'app',
        component: Layout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            { path: 'dashboard', component: Dashboard}
        ]
    },
    {   path: '**',
        redirectTo: 'accueil'
    }
];
