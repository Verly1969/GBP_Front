import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-two-factor',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './two-factor.html',
  styleUrl: './two-factor.css',
})
export class TwoFactor implements OnInit {
  private readonly fb          = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);

  // Données reçues depuis le composant Login
  @Input() email!       : string;
  @Input() qrCodeUri!   : string | null;
  @Input() secretKey!   : string | null;
  @Input() isFirstLogin!: boolean;

  qrCodeImage  = ''; // image générée par qrcode
  errorMessage = '';
  isLoading    = false;

  form = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  // Génération de l'image QR code
  async ngOnInit(): Promise<void> {
    if (this.qrCodeUri) {
      // Transforme l'URI en image Base64 affichable dans une balise <img>
      this.qrCodeImage = await QRCode.toDataURL(this.qrCodeUri, {
        width: 256,
        margin: 2
      })
    }
  }

  // Soumission du code TOTP
  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading    = true;
    this.errorMessage = '';

    this.authService.verifyTwoFactor({
      email: this.email,
      code : this.form.value.code!
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Invalid code. Please try again.';
      }
    });
  }

  get codeErrors(): string | null {
    const ctrl = this.form.get('code');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['required']) return 'Code is required';
      if (ctrl.errors['pattern']) return 'Code must be exactly 6 digits';
    }

    return null;
  }
}
