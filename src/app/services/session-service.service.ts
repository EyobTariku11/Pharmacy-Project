import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private statusSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  startSessionPolling() {
    const email = localStorage.getItem('email');
    if (!email) return;

    this.statusSubscription = interval(5000).subscribe(() => {
      this.authService.checkUserStatus(email).subscribe({
        next: (res) => {
          if (res.status === 'Blocked') {
            Swal.fire({
              icon: 'error',
              title: 'Account Blocked',
              text: 'Your account was blocked by admin.',
              confirmButtonColor: '#d33'
            });
            this.authService.logout();
            this.router.navigate(['/login']);
            this.stopPolling();
          }
        },
        error: (err) => console.error('Status polling error:', err)
      });
    });
  }

  stopPolling() {
    this.statusSubscription?.unsubscribe();
  }
}
