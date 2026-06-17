import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditService } from '../../../core/services/credit.service';
import { CreditResponse } from '../../../core/models/credit.model';
import { CreditTypeService } from '../../../core/services/credit-type.service';
import { CreditTypeResponse } from '../../../core/models/credit-type.model';
import { ComfirmDialog } from '../../../shared/components/comfirm-dialog/comfirm-dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-credit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComfirmDialog
  ],
  templateUrl: './credit.html',
  styleUrl: './credit.css',
})
export class Credit implements OnInit {

  private readonly route         = inject(ActivatedRoute);
  private readonly fb                = inject(FormBuilder);
  private readonly creditService     = inject(CreditService);
  private readonly creditTypeService = inject(CreditTypeService);

  accountId    = signal<string>('');
  credits      = signal<CreditResponse[]>([]);
  creditTypes  = signal<CreditTypeResponse[]>([]);
  isLoading    = signal(true);
  errorMessage = signal('');
  showForm     = signal(false);
  editingId    = signal<string | null>(null);

  showConfirm    = signal(false);
  confirmMessage = signal('');
  selectedId     = signal<string | null>(null);

  form = this.fb.group({
    amount:         ['', [Validators.required, Validators.min(0.01)]],
    interestRate:   ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    durationMonths: ['', [Validators.required, Validators.min(1), Validators.max(600)]],
    startDate:      ['', Validators.required],
    creditTypeId:   ['', [Validators.required, Validators.min(1)]],
    raison:         ['', Validators.maxLength(255)]
  })

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('accountId') ?? '';

    this.accountId.set(id)
    this.loadCredits();
    this.loadCreditTypes();
  }

  // Charger les crédits
  loadCredits(): void {
    this.isLoading.set(true);
    this.creditService.getAll(this.accountId()).subscribe({
      next: (data) => {
        this.credits.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.errors?.message ?? 'Erreur lors du chargement des crédits'
        )
        toast.error(this.errorMessage())
      }
    })
  }

  // Charger les types de crédit
  loadCreditTypes(): void {
    this.creditTypeService.getAll().subscribe({
      next: (data) => this.creditTypes.set(data),
      error: () => {}
    })
  }

  // Ouvrir le formulaire de création
  openCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  // Ouvrir le formulaire de modification
  openEdit(credit: CreditResponse): void {
    this.editingId.set(credit.id);
    this.form.patchValue({
      amount:         credit.amount.toString(),
      interestRate:   credit.interestRate.toString(),
      durationMonths: credit.durationMonths.toString(),
      startDate:      new Date(credit.startDate).toISOString().split('T')[0],
      creditTypeId:   credit.creditTypeId.toString(),
      raison:         credit.raison
    });
    this.showForm.set(true);
  }

  // Ouvrir popup de suppression
  openDelete(credit: CreditResponse): void {
    this.selectedId.set(credit.id);
    this.confirmMessage.set(
      `Etes-vous sûr de vouloir supprimer le credit d'un montant de ${credit.amount} € ?`
    )
    this.showConfirm.set(true);
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.form.invalid) return;

    const accountId = this.accountId();

    const request = {
      amount:         Number(this.form.value.amount),
      interestRate:   Number(this.form.value.interestRate),
      durationMonths: Number(this.form.value.durationMonths),
      startDate:      new Date(this.form.value.startDate as string),
      creditTypeId:   Number(this.form.value.creditTypeId),
      raison:         this.form.value.raison ?? null,
      previousCreditId: null
    }

    const id = this.editingId();

    const operation = id
      ? this.creditService.update(accountId, id, request)
      : this.creditService.create(accountId, request)

    operation.subscribe({
      next: () => {
        this.loadCredits();
        this.showForm.set(false);
        this.form.reset();
        toast.success('Opération réussie');
      },
      error: (err) => {
        const msg = err.errors?.message ?? 'Erreur lors de l\'opération';
        toast.error(msg);
      }
    })
  }

  // Annuler le formulaire
  onCancel(): void {
    this.showForm.set(false);
    this.form.reset();
    this.editingId.set(null);
  }

  // Confirmer la suppression
  onConfirmed(): void {
    this.showConfirm.set(false);

    const id = this.selectedId();

    if (!id) return;

    this.creditService.delete(this.accountId(), id).subscribe({
      next: () => {
        this.selectedId.set(null);
        this.loadCredits();
        toast.success('Crédit supprimé')
      },
      error: (err) => {
        this.errorMessage.set(
          err.errors?.message ?? 'Erreur lors de la suppression'
        )
        toast.error(this.errorMessage())
      }
    })
  }

  // Annuler la suppression
  onCanceled(): void {
    this.showConfirm.set(false);
    this.selectedId.set(null);
  }

  // Helper de validation
  get amountErrors(): string | null {

    const ctrl = this.form.get('amount');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['required']) return 'Le montant est obligatoire.';
      if (ctrl.errors['min']) return 'Le montant minimum doit être de 0,01 €.';
    }

    return null;
  }

  get interestErrors(): string | null {

    const ctrl = this.form.get('interestRate');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['required']) return 'Le taux d\'intérêt est obligatoire.';
      if (ctrl.errors['min']) return 'Minimum 0 %.';
      if (ctrl.errors['max']) return 'maximum 100 %.';
    }

    return null;
  }

  get durationErrors(): string | null {

    const ctrl = this.form.get('durationMonths');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['required']) return 'La durée en mois est obligatoire.';
      if (ctrl.errors['min']) return 'Minimum 1 mois.';
      if (ctrl.errors['max']) return 'maximum 600 mois.';
    }

    return null;
  }

  get startDateErrors(): string | null {

    const ctrl = this.form.get('startDate');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['required']) return 'La date de début est obligatoire.';
    }

    return null;
  }

  get creditTypeErrors(): string | null {

    const ctrl = this.form.get('creditType');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['required'] || ctrl.errors['min']) return 'Le type de crédit est obligatoire.';
    }

    return null;
  }

  get raisonErrors(): string | null {

    const ctrl = this.form.get('raison');

    if (ctrl?.touched && ctrl.errors) {
      if (ctrl.errors['maxlength']) return 'maximum 255 caractères.';
    }

    return null;
  }

  // titre du formulaire
  get formTitle(): string {

    return this.editingId() ? 'Modifier le crédit' : 'Nouveau crédit';
  }
}
