import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login')
                .then(l => l.Login)
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./features/pages/dashboard/dashboard')
                .then(d => d.Dashboard)
    },
    { path: '',   redirectTo: 'login', pathMatch: 'full'},
    { path: '**', redirectTo: 'login'}
];
