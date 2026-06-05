import { Component, inject, OnInit, Input, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { toast } from 'ngx-sonner';
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
  private readonly cdr         = inject(ChangeDetectorRef);

  // Données reçues depuis le composant Login
  @Input() email!       : string;
  @Input() qrCodeUri!   : string | null;
  @Input() secretKey!   : string | null;
  @Input() isFirstLogin!: boolean;

  qrCodeImage  = signal(''); // image générée par qrcode
  errorMessage = signal('');
  isLoading    = signal(false);

  form = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  // Génération de l'image QR code
  async ngOnInit(): Promise<void> {
    console.log('TwoFactorComponent initialisé');
    console.log('isFirstLogin :', this.isFirstLogin);
    console.log('qrCodeUri :', this.qrCodeUri);
    console.log('email :', this.email);
    console.log('secretKey :', this.secretKey);

    if (this.qrCodeUri) {
      try
      {
        // Transforme l'URI en image Base64 affichable dans une balise <img>
        const image = await QRCode.toDataURL(this.qrCodeUri, {
          width: 256,
          margin: 2
        });
        this.qrCodeImage.set(image);
        // pour éviter l'erreur NG0100
        this.cdr.detectChanges(); // force la mise à jour
        console.log('QR code généré :', image.substring(0, 50));
      } catch (err) {
        console.log('Erreur génération QR code :', err);
      }
    } else {
      console.log('qrCodeUri est null — pas de QR code généré');
    }
  }

  // Soumission du code TOTP
  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.verifyTwoFactor({
      email: this.email,
      code : this.form.value.code!
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['app/dashboard']);
        toast.success('Connexion réussie');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.error?.message ?? 'Invalid code. Please try again.';
        toast.error('Connexion refusée');
        this.router.navigate(['./login']);
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
