import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { AccountResponse } from '../../../core/models/account.model';
import { AccountTypeService } from '../../../core/services/account-type.service';
import { AccountTypeResponse } from '../../../core/models/account-type.model';
import { ComfirmDialog } from '../../../shared/components/comfirm-dialog/comfirm-dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComfirmDialog
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {

  private readonly fb                 = inject(FormBuilder);
  private readonly router             = inject(Router);
  private readonly accountService     = inject(AccountService);
  private readonly accountTypeService = inject(AccountTypeService);

  accounts =     signal<AccountResponse[]>([]);
  accountTypes = signal<AccountTypeResponse[]>([]);
  isLoading =    signal(true);
  errorMessage = signal('');
  showForm =     signal(false);
  editingId =    signal<string | null>(null);

  showConfirm =    signal(false);
  confirmMessage = signal('');
  selectedId =     signal<string | null>(null);

  form = this.fb.group({
    label: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    number: ['', Validators.maxLength(50)],
    accountTypeId: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    
    this.loadAccounts();
    this.loadAccountTypes();
  }

  // Charger les comptes
  loadAccounts(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.accountService.getAll().subscribe({
      next: (data) => {
        this.accounts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.errors?.message ?? 'Erreur lors du chargement des comptes.'
        );
        this.isLoading.set(false);
        toast.error(this.errorMessage())
      }
    })
  }

  // Charger les types de comptes
  loadAccountTypes(): void {

    this.accountTypeService.getAll().subscribe({
      next: (data) => this.accountTypes.set(data),
      error: () => {} // silencieux, non bloquant
    })
  }

  // Ouvrir le formulaire de création
  openCreate(): void {

    this.editingId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  // Ouvrir le formulaire de modification
  openEdit(account: AccountResponse): void {

    this.editingId.set(account.id);
    this.form.patchValue({
      label: account.label,
      number: account.number,
      accountTypeId: account.accountTypeId
    });
    this.showForm.set(true);
  }

  // Soumettre le formulaire
  onSubmit(): void {

    if (this.form.invalid) return;

    const request = {
      label:         this.form.value.label!,
      number:        this.form.value.number ?? null,
      accountTypeId: this.form.value.accountTypeId!
    };

    const id = this.editingId();

    const operation = id
      ? this.accountService.update(id, request)
      : this.accountService.create(request);

    operation.subscribe({
      next: () => {
        this.showForm.set(false);
        this.form.reset();
        this.loadAccounts();
        toast.success('Opération réussie');
      },
      error: (err) => {
        this.errorMessage.set(
          err.errors?.message ?? 'Erreur lors de la sauvegarde.'
        );
        toast.error(this.errorMessage());
      }
    })
  }

  // Annuler le formulaire
  onCancel(): void {

    this.showForm.set(false);
    this.form.reset();
    this.editingId.set(null);
  }

  // Ouvrir popup de suppression
  openDelete(account: AccountResponse): void {

    this.selectedId.set(account.id);
    this.confirmMessage.set(
      `Etes-vous sûr de vouloir supprimer le compte "${account.label}" ?`
    );
    this.showConfirm.set(true);
  }

  // Ouvrir page de crédit
  openCredit(accountId: string): void {
    this.router.navigate(['/app/account', accountId, 'credit']);
  }

  // Confirmer suppression
  onConfirmed(): void {

    this.showConfirm.set(false);

    const id = this.selectedId();

    if (!id) return;

    this.accountService.delete(id).subscribe({
      next: () => {
        this.selectedId.set(null);
        this.loadAccounts();
      },
      error: (err) => {
        this.errorMessage.set(
          err.errors?.message ?? 'Erreur lors de la suppression'
        );
      }
    });
  }

  // Annuler la suppression
  onCancelled(): void {

    this.showConfirm.set(false);
    this.selectedId.set(null);
  }

  // Helper de validation
  get labelErrors(): string | null {

    const ctrl = this.form.get('label');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['required']) return 'Le libellé est obligatoire.';
      if (ctrl.errors['minlength']) return 'Minimum 3 caractères.';
      if (ctrl.errors['maxlength']) return 'maximum 100 caractères.';
    }

    return null;
  }

  get numberErrors(): string | null {

    const ctrl = this.form.get('number');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['maxlength']) return 'Maximum 50 caractères.';
    }

    return null;
  }

  get accountTypeErrors(): string | null {

    const ctrl = this.form.get('accountTypeId');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['required'] || ctrl.errors['min']) return 'Le type de compte est obligatoire.';
    }

    return null;
  }

  // titre du formulaire
  get formTitle(): string {

    return this.editingId() ? 'Modifier le compte' : 'Nouveau compte';
  }
}
