import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl } from '@angular/forms'; // Classe de base dont les contrôles formulaire hérite 
import { tap } from 'rxjs';
import { LoginRequest, LoginResponse, TwoFactorRequest, RegisterRequest } from '../models/auth.model';

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

  constructor() {
    this.restoreSession(); // Restaure la session
  }

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
            this.saveSession(response);
          }
        })
      )
  }

  // Register
  register(request: RegisterRequest) {
    return this.http
      .post<void>(`${this.apiUrl}/Auth/register`, request);
  }

  // Vérification du code TOTP
  verifyTwoFactor(request: TwoFactorRequest) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/Auth/2fa/verify`, request)
      .pipe(
        tap(response =>{
          // Cette fois on a le token
          if (response.accessToken) {
            this.saveSession(response);
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
    this.router.navigate(['/accueil']);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('gbp_token');
  }

// ===========================================================
// Methodes partagées - Login, Register
// ===========================================================

  // Toggle visibilité mot de passe
  toggleVisibilityPassword(showPassword: ReturnType<typeof signal<boolean>>): void {
    showPassword.update(v => !v); // On inverse le booléen
  }

  // Erreurs emails
  getEmailErrors(ctrl: AbstractControl | null): string | null {

    if (!ctrl?.touched || !ctrl?.errors) return null;
    if (ctrl.errors['required']) return "L'email est obligatoire";
    if (ctrl.errors['email']) return "Format d'email invalide";
    return null;
  }

  // Erreurs mot de passe
  getPasswordErrors(ctrl: AbstractControl | null): string | null {

    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) return "Le mot de passe est obligatoire";
    if (ctrl.errors['minlength']) return "Minimum 9 caractères"
    return null;
  }

  // Erreurs de champs génériques
  getRequiredErrors(ctrl: AbstractControl | null, control: string): string | null {

    if (!ctrl?.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) return `${control} est obligatoire`;
    return null;
  }

// ===========================================================
// Methodes privées 
// ===========================================================

  // Sauvegarde la session (évite la duplication)
  private saveSession(response: LoginResponse): void {
    localStorage.setItem('gbp_token', response.accessToken!);
    localStorage.setItem('gbp_user', JSON.stringify(response));

    this.currentUser.set(response);
    this.isLoggedIn.set(true);
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
