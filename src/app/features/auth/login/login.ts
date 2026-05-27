import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from '../../../shared/components/header/header';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    Footer
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);

  errorMessage = '';
  isLoading    = false;
  showPassword = false;

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;

    console.log('Formulaire soumis: ', this.form.value);

    // TODO : connecter AuthService
  }

  get emailErrors(): string | null {
    const ctrl = this.form.get('email');

    if (ctrl?.touched && ctrl?.errors) {
      if (ctrl.errors['required']) return "L'email est obligatoire";
      if (ctrl.errors['email']) return "Format d'email invalide";
    }

    return null;
  }

  get passwordErrors(): string | null {
    const ctrl = this.form.get('password');

    if (ctrl?.touched && ctrl?.errors) {
      if (ctrl.errors['required']) return "Le mot de passe est obligatoire";
      if (ctrl.errors['minLength']) return "Minimum 6 caractères";
    }

    return null;
  }

}
