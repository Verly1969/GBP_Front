import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginRequest, LoginResponse, TwoFactorRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // -- Injections de dépendances
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);

  // -- URL de l'API
  private readonly apiUrl = '/api';

  // -- Etat de l'application
  readonly currentUser = signal<LoginResponse | null>(null);
  readonly isLoggedIn  = signal<boolean>(false);

  // Login
  login(request: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${ this.apiUrl }/Auth/login`, request)
      .pipe(
        tap(response => {
          // On stocke uniquement si on a un token
          // (pas dans le cas quand 2FA est requis)
          if (response.accessToken)
          {
            localStorage.setItem('gbp_token', response.accessToken);
            localStorage.setItem('gbp_user',  JSON.stringify(response));
            this.currentUser.set(response);
            this.isLoggedIn.set(true);
          }
        })
      )
  }

  // Vérification du code TOTP
  verifyTwoFactor(request: TwoFactorRequest) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/Auth/2fa/verify`, request)
      .pipe(
        tap(response =>{
          // Cette fois on a le token
          if (response.accessToken) {
            localStorage.setItem('gbp_token', response.accessToken);
            localStorage.setItem('gbp_user' , JSON.stringify(response.accessToken));
            this.currentUser.set(response);
            this.isLoggedIn.set(true);
          }
        })
      )
  }

  // Logout
  logout(): void {
    localStorage.removeItem('gbp_token');
    localStorage.removeItem('gbp_user');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('gbp_token');
  }

  // Restaurer la session au rechargement
  private restoreSession(): void {
    const token    = localStorage.getItem('gbp_token');
    const userJson = localStorage.getItem('gbp_user');

    if (!token || !userJson) return;

    if (this.isTokenExpired(token)) {
      this.logout();
      return;
    }

    const user = JSON.parse(userJson) as LoginResponse;
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
  }

  // Vérifier si le token est expiré
  private isTokenExpired(token: string): boolean {
    try
    {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return Date.now() > decoded.exp * 1000;
    }
    catch
    {
      return true;
    }
  }
  
}
