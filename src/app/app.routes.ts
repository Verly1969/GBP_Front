import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { Layout } from './features/pages/layout/layout';

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
            { 
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/pages/dashboard/dashboard')
                        .then(d => d.Dashboard) 
            },
            { 
                path: 'profil',
                loadComponent: () =>
                    import('./features/pages/profil/profil')
                        .then(p => p.Profil) 
            },
            { 
                path: 'email',
                loadComponent: () =>
                    import('./features/pages/email/email')
                        .then(e => e.Email)
            },
            { 
                path: 'password', 
                loadComponent: () =>
                    import('./features/pages/password/password')
                        .then(p => p.Password) 
            },
            { 
                path: 'account', 
                loadComponent: () =>
                    import('./features/pages/account/account')
                        .then(a => a.Account) 
            },
            { 
                path: 'operations', 
                loadComponent: () =>
                    import('./features/pages/operations/operations')
                        .then(o => o.Operations)
            },
            { 
                path: 'admin/users', 
                loadComponent: () =>
                    import('./features/pages/users/users')
                        .then(u => u.Users)
            },
            { 
                path: 'admin/category', 
                loadComponent: () =>
                    import('./features/pages/category/category')
                        .then(c => c.Category)
            },
            { 
                path: 'admin/account-types', 
                loadComponent: () =>
                    import('./features/pages/account-types/account-types')
                        .then(a => a.AccountTypes)
            }
        ]
    },
    {   path: '**', redirectTo: 'accueil' }
];
