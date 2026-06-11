import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AccountTypeService } from '../../../core/services/account-type.service';
import { AccountTypeResponse } from '../../../core/models/account-type.model';
import { ComfirmDialog } from '../../../shared/components/comfirm-dialog/comfirm-dialog';

@Component({
  selector: 'app-account-types',
  imports: [
    CommonModule,
    ComfirmDialog,
    ReactiveFormsModule
  ],
  templateUrl: './account-types.html',
  styleUrl: './account-types.css',
})
export class AccountTypes implements OnInit {

  private readonly accountTypeService = inject(AccountTypeService);
  private readonly fb                 = inject(FormBuilder);

  accountTypes = signal<AccountTypeResponse[]>([]);
  isLoading    = signal(true);
  errorMessage = signal('');
  showForm     = signal(false);
  editingId    = signal<number | null>(null);

  showConfirm    = signal(false);
  confirmMessage = signal('');
  selectedId     = signal<number | null>(null);

  form = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', Validators.maxLength(255)]
  });

  ngOnInit(): void {
    this.loadAccountTypes();
  }

  // Charger la liste
  loadAccountTypes(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.accountTypeService.getAll().subscribe({
      next: (data) => {
        this.accountTypes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ?? 'Erreur lors du chargement.'
        );
        this.isLoading.set(false);
      }
    });
  }

  // Ouvrir le formulaire de création
  openCreate(): void {

    this.editingId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  // Ouvrir le formulaire de modification
  openEdit(accountType: AccountTypeResponse): void {

    this.editingId.set(accountType.id);
    this.form.patchValue({
      name:        accountType.name,
      description: accountType.description
    });

    this.showForm.set(true);
  }

  // Soumettre le formulaire
  onSubmit(): void {

    if (this.form.invalid) return;

    const request = {
      name:        this.form.value.name!,
      description: this.form.value.description ?? null
    };

    const id = this.editingId();

    const operation = id
      ? this.accountTypeService.update(id, request)
      : this.accountTypeService.create(request); 

    operation.subscribe({
      next: () => {
        this.showForm.set(false);
        this.form.reset();
        this.loadAccountTypes();
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ?? 'Erreur lors de la sauvegarde.'
        );
      }
    });
  }

  // Annuler le formulaire
  onCancel(): void {

    this.showForm.set(false);
    this.form.reset();
    this.editingId.set(null);
  }

  // Ouvrir la popup de suppression
  openDelete(accountType: AccountTypeResponse): void {

    this.selectedId.set(accountType.id);
    this.confirmMessage.set(
      `Etes-vous sûr de vouloir supprimer "${accountType.name}" ?`
    );
    this.showConfirm.set(true);
  }

  // Confirmer la suppression
  onConfirmed(): void {

    this.showConfirm.set(false);

    const id = this.selectedId();

    if (id === null) return;

    this.accountTypeService.delete(id).subscribe({
      next: () => {
        this.selectedId.set(null);
        this.loadAccountTypes();
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ?? 'Erreur lors de la suppression.'
        );
      }
    })
  }

  // Annuler la suppression
  onCancelled(): void {

    this.showConfirm.set(false);
    this.selectedId.set(null);
  }

  // Helpers validation
  get nameErrors(): string | null {
    
    const ctrl = this.form.get('name');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['required']) return 'Le nom est obligatoire';
      if (ctrl.errors['minlength']) return 'Minimum 3 caractères';
      if (ctrl.errors['maxlength']) return 'Maximum 50 caractères';
    }

    return null;
  }

  get descriptionErrors() : string | null {

    const ctrl = this.form.get('description');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['maxlength']) return 'Maximum 255 caractères';
    }

    return null;
  }

  // titre du formulaire
  get formTitle(): string {

    return this.editingId() ? 'Modifier le type' : 'Nouveau type';
  }
}
