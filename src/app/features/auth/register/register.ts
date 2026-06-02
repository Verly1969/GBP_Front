import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Footer } from '../../../shared/components/footer/footer';
import { Login } from '../login/login';

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
  private readonly login       = inject(Login);
  private readonly router      = inject(Router);
  private readonly authService = inject(AuthService);

  showPassword = signal(false);
  
  form = this.fb.group({
    firstname: ['', [Validators.required, Validators.minLength(3)]],
    lastname:  ['', [Validators.required, Validators.minLength(3)]]
  })

  togglePassword(): void {
    this.showPassword.set(!this.showPassword);
  }

  get passwordErrors(): string | null {
    const ctrl = this.form.get('password');

    if (ctrl?.touched && ctrl?.errors) {
      if (ctrl.errors['required']) return "Le mot de passe est obligatoire";
      if (ctrl.errors['minlength']) return "Minimum 6 caractères";
    }

    return null;
  }
}
