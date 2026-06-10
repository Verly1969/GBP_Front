import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { Layout } from './features/pages/layout/layout';
import { Dashboard } from './features/pages/dashboard/dashboard';
import { Profil } from './features/pages/profil/profil';
import { Email } from './features/pages/email/email';
import { Password } from './features/pages/password/password';
import { Comptes } from './features/pages/comptes/comptes';
import { Operations } from './features/pages/operations/operations';
import { Users } from './features/pages/users/users';
import { Category } from './features/pages/category/category';

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
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'profil', component: Profil },
            { path: 'email', component: Email },
            { path: 'password', component: Password },
            { path: 'account', component: Comptes },
            { path: 'operations', component: Operations},
            { path: 'admin/users', component: Users},
            { path: 'admin/category', component: Category}
        ]
    },
    {   path: '**', redirectTo: 'accueil' }
];
