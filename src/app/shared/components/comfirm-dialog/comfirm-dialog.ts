import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comfirm-dialog',
  imports: [
    CommonModule
  ],
  templateUrl: './comfirm-dialog.html',
  styleUrl: './comfirm-dialog.css',
})
export class ComfirmDialog {

  @Input() title        = 'Changer le statut';
  @Input() message      = 'Etes-vous sûr ?';
  @Input() confirmLabel = 'Confirmer';
  @Input() cancelLabel  = 'Annuler';
  @Input() type: 'warning' | 'danger' | 'info' = 'warning';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
