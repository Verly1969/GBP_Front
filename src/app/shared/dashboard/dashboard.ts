import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AdminDashboard } from '../../features/pages/admin-dashboard/admin-dashboard';
import { UserDashboard } from '../../features/pages/user-dashboard/user-dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    AdminDashboard,
    UserDashboard
],
  template: `
    @if (authService.currentUser()?.role === 'Admin') {
      <app-admin-dashboard />
    }
    @else {
      <app-user-dashboard />
    }`
})
export class Dashboard {

  readonly authService = inject(AuthService);
}
