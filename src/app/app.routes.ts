import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login')
                .then(l => l.Login)
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
            import('./features/pages/dashboard/dashboard')
                .then(d => d.Dashboard)
    },
    {   path: '',
        loadComponent: () =>
            import('./features/pages/accueil/accueil')
                .then(a => a.Accueil)
    },
    {   path: '**',
        loadComponent: () =>
            import('./features/pages/accueil/accueil')
                .then(a => a.Accueil)
    }
];
