import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditTypeService } from '../../../core/services/credit-type.service';
import { CreditTypeResponse } from '../../../core/models/credit-type.model';
import { ComfirmDialog } from '../../../shared/components/comfirm-dialog/comfirm-dialog';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-credit-types',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComfirmDialog
  ],
  templateUrl: './credit-types.html',
  styleUrl: './credit-types.css',
})
export class CreditTypes implements OnInit {

  private readonly creditService = inject(CreditTypeService);
  private readonly fb            = inject(FormBuilder);

  errorMessage = signal('');
  isLoading    = signal(true);
  showForm     = signal(false);
  creditTypes  = signal<CreditTypeResponse[]>([]);
  editingId    = signal<number | null>(null);

  showConfirm    = signal(false);
  confirmMessage = signal('');
  selectedId     = signal<number | null>(null);

  form = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', Validators.maxLength(255)]
  })

  ngOnInit(): void {
    this.loadCreditTypes();
  }

  // Charger la liste
  loadCreditTypes(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.creditService.getAll().subscribe({
      next: (data) => {
        this.creditTypes.set(data);
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
  openEdit(creditType: CreditTypeResponse): void {

    this.editingId.set(creditType.id);
    this.form.patchValue({
      name:        creditType.name,
      description: creditType.description
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
      ? this.creditService.update(id, request)
      : this.creditService.create(request); 

    operation.subscribe({
      next: () => {
        this.showForm.set(false);
        this.form.reset();
        this.loadCreditTypes();
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
  openDelete(creditType: CreditTypeResponse): void {

    this.selectedId.set(creditType.id);
    this.confirmMessage.set(
      `Etes-vous sûr de vouloir supprimer "${creditType.name}" ?`
    );
    this.showConfirm.set(true);
  }

  // Confirmer la suppression
  onConfirmed(): void {

    this.showConfirm.set(false);

    const id = this.selectedId();

    if (id === null) return;

    this.creditService.delete(id).subscribe({
      next: () => {
        this.selectedId.set(null);
        this.loadCreditTypes();
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
