import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { UserResponse } from '../../../core/models/user.model';
import { ComfirmDialog } from '../../../shared/components/comfirm-dialog/comfirm-dialog';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    ComfirmDialog
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {

  private readonly userService = inject(UserService);

  users        = signal<UserResponse[]>([]);
  isLoading    = signal(true);
  errorMessage = signal('');

  // Popup de confirmation
  showConfirm    = signal(false);
  confirmMessage = signal('');
  selectedEmail  = signal('');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ?? 'Erreur lors du chargement des utilisateurs');
        
        this.isLoading.set(false);
      }
    })
  }

  openConfirm(email: string, currentStatus: string): void {

    const action = currentStatus === 'Active' ? 'désactiver' : 'activer';

    this.selectedEmail.set(email);
    this.confirmMessage.set(
      `Etes-vous sûr de vouloir ${action} l'utilisateur ${email} ?`
    );
    this.showConfirm.set(true);
  }

  onConfirmed(): void {

    this.showConfirm.set(false);

    this.userService.changeStatus(this.selectedEmail()).subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ?? 'Erreur lors du changement de statut.'
        );
      }
    })
  }

  onCancelled(): void {
    this.showConfirm.set(false);
    this.selectedEmail.set('');
  }
}
