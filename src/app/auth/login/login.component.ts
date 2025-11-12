import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService, AuthResponse, LoginData } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  private emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.email.trim() || !this.password.trim()) {
      Swal.fire({ icon: 'error', title: 'Missing Fields', text: 'Please fill in both email and password!', confirmButtonColor: '#d33' });
      return;
    }
    if (!this.emailPattern.test(this.email.trim())) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address!', confirmButtonColor: '#d33' });
      return;
    }

    const credentials: LoginData = { email: this.email.trim(), password: this.password.trim() };

    this.authService.login(credentials).subscribe({
      next: (res: AuthResponse) => {
        if (res.status === 'Pending') {
          Swal.fire({ icon: 'info', title: 'Account Pending', text: 'Your account is not approved yet. Please wait.', confirmButtonColor: '#3085d6' });
          return;
        }
        if (res.status === 'Blocked') {
          Swal.fire({ icon: 'error', title: 'Account Blocked', text: 'Your account is blocked. Contact admin.', confirmButtonColor: '#d33' });
          return;
        }

        this.authService.storeLoginInfo(res);

        // SignalR real-time updates
        this.authService.startSignalR(res.email || this.email, (status: string) => {
          if (status === 'Blocked') {
            Swal.fire({ icon: 'error', title: 'Account Blocked', text: 'Your account was blocked by admin.', confirmButtonColor: '#d33' });
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        });

        // Navigate based on role
        const role = res.role.replace(/\s+/g, '').toLowerCase();
        if (role === 'pharmacyowner') this.router.navigate(['/ownerhome']);
        else if (role === 'customer') this.router.navigate(['/customer']);
        else if (role === 'admin') this.router.navigate(['/admin']);
        else this.router.navigate(['/landing']);

        Swal.fire({ icon: 'success', title: 'Login Successful', text: `Welcome, ${res.fullName || this.email}!`, confirmButtonColor: '#3085d6' });
      },
      error: (err: any) => {
        let msg = 'An unexpected error occurred during login.';
        if (err.status === 401) msg = err.error?.message || 'Invalid email or password';
        else if (err.status === 400) msg = err.error?.message || 'Bad request';
        else if (err.error?.message) msg = err.error.message;

        Swal.fire({ icon: 'error', title: 'Login Failed', text: msg, confirmButtonColor: '#d33' });
        console.error('Login error details:', err);
      }
    });
  }
}
