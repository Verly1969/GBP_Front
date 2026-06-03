import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Footer } from '../../../shared/components/footer/footer';
import { toast } from 'ngx-sonner';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Footer
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private readonly fb          = inject(FormBuilder);
  private readonly router      = inject(Router);
  private readonly authService = inject(AuthService);

  showPassword = signal(false);
  isLoading    = signal(false);
  errorMessage = signal('');
  
  form = this.fb.group({
    firstname:       ['', [Validators.required, Validators.minLength(3)]],
    lastname:        ['', [Validators.required, Validators.minLength(3)]],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(9)]],
    confirmPassword: ['', Validators.required, Validators.minLength(9)]
  })

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register({
      firstname: this.form.value.firstname!,
      lastname: this.form.value.lastname!,
      password: this.form.value.password!,
      email: this.form.value.email!
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        toast.success('Compte créé avec succès.');
        this.router.navigate(['login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? "Erreur lors de l'inscription");
        toast.error(this.errorMessage());
      }
    })
  }

// ===========================================================
// Methodes déléguées de AuthService 
// ===========================================================
  togglePassword(): void { this.authService.toggleVisibilityPassword(this.showPassword); }

  get firstnameErrors(): string | null { return this.authService.getRequiredErrors(this.form.get('firstname'), 'Le prénom'); }
  get lastnameErrors():  string | null { return this.authService.getRequiredErrors(this.form.get('lastname'), "Le nom de famille"); } 
  get passwordErrors() : string | null { return this.authService.getPasswordErrors(this.form.get('password')); }
}
