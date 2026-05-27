import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // -- Injections de dépendances
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);

  // -- URL de l'API
  private readonly apiUrl = 'https://localhost:7161/api';

  // -- Etat de l'application
  readonly currentUser = signal<LoginResponse | null>(null);
  readonly isLoggedIn  = signal<boolean>(false);

  login(request: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${ this.apiUrl }/Auth/login`, request)
      .pipe(
        tap(response => {
          this.currentUser.set(response);
          this.isLoggedIn.set(true);
        })
      )
  }

  logout(): void {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
  
}
