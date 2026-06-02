import { inject, Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast.model';
import { SelectControlValueAccessor } from '@angular/forms';
import { withExperimentalPlatformNavigation } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info', duration = 4000): void {

    const toast: Toast = { id: ++this.nextId, message, type };

    // Ajouter le toast
    this.toasts.update(toasts => [...toasts, toast]);

    // Supprimer le toast
    setTimeout(() => this.remove(toast.id), duration);
  }
    
  success(message: string): void { this.show(message, 'success'); }
  warning(message: string): void { this.show(message, 'warning'); }
  error(message: string): void   { this.show(message, 'error'); }
  info(message: string): void    { this.show(message, 'info'); }
  
  remove(id: number): void       { this.toasts.update(toasts => toasts.filter(t => t.id == id)); }
  
}
