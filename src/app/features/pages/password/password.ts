import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-password',
  imports: [],
  templateUrl: './password.html',
  styleUrl: './password.css',
})
export class Password {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  showPassword = signal(false);
  isLoading    = signal(false);

  form = this.fb.group({
    oldPassword:     ['', Validators.required],
    newPassword:     ['', Validators.required],
    confirmPassword: ['', Validators.required]
  })

// ===========================================================
// Methodes déléguées de AuthService 
// ===========================================================
  togglePassword(): void { this.authService.toggleVisibilityPassword(this.showPassword); }

  get firstnameErrors(): string | null { return this.authService.getRequiredErrors(this.form.get('firstname'), 'Le prénom'); }
  get lastnameErrors():  string | null { return this.authService.getRequiredErrors(this.form.get('lastname'), "Le nom de famille"); } 
  get passwordErrors() : string | null { return this.authService.getPasswordErrors(this.form.get('password')); }
  get confirmPasswordErrors(): string | null {
    return this.authService.getConfirmPasswordErrors(
      this.form.get('confirmPassword'),
      this.form
    )
  }  
}
