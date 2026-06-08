import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Footer } from '../../../shared/components/footer/footer';
import { AuthService } from '../../../core/services/auth.service';
import { ScrollService } from '../../../core/services/scroll.service';
import { TwoFactor } from '../two-factor/two-factor';
import { LoginResponse } from '../../../core/models/auth.model';
import { toast } from 'ngx-sonner';
import { Header } from "../../../shared/components/header/header";

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Footer,
    TwoFactor,
    Header
],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  private readonly fb            = inject(FormBuilder);
  private readonly authService   = inject(AuthService);
  private readonly scrollService = inject(ScrollService);
  private readonly router        = inject(Router);

  ngOnInit(): void     { this.scrollService.hide(); }
  ngOnDestroy(): void  { this.scrollService.show(); }

  errorMessage  = signal('');
  isLoading     = signal(false);
  showPassword  = signal(false);
  showTwoFactor = signal(false);
  loginData     = signal<LoginResponse | null> (null);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(9)]]
  });

  goToRegister(): void {
    this.router.navigate(['./register']);
  }

  onSubmit(): void {
    // Si le formulaire est invalide, on arrête tout
    if (this.form.invalid) return;

    // On active le spinner de chargement
    this.isLoading.set(true);
    this.errorMessage.set('');

    // On appelle le service avec les valeurs du formulaire
    this.authService.login({
      email   : this.form.value.email!,
      password: this.form.value.password!
    }).subscribe({
      // Succès
      next: (response) => {

        this.isLoading.set(false);
        
        if (response.twoFactorRequired){
          // 2FA requis - afficher le composant TwoFactor
          this.loginData.set(response);
          this.showTwoFactor.set(true);
        } else {
          // pas de 2FA requis - rediriger directement
          this.router.navigate(['app/dashboard']);
        }
      },
      // Erreur
      error: () => {
        this.isLoading.set(false);
      }
    })

    console.log('Formulaire soumis: ', this.form.value);

  }

// ===========================================================
// Methodes déléguées de AuthService 
// ===========================================================
  togglePassword(): void { this.authService.toggleVisibilityPassword(this.showPassword); }

  get emailErrors(): string | null { return this.authService.getEmailErrors(this.form.get('email')); }

  get passwordErrors(): string | null { return this.authService.getPasswordErrors(this.form.get('password')); }

}
