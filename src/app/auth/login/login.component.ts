import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], /* app module */
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  private emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private authService: AuthService, private router: Router) {} /* send to backend &route */

  onLogin(): void {
    if (!this.email.trim() || !this.password.trim()) {
      Swal.fire({ icon: 'error', title: 'Missing Fields', text: 'Please fill in both email and password!', confirmButtonColor: '#d33' });
      return;
    }

    if (!this.emailPattern.test(this.email.trim())) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address!', confirmButtonColor: '#d33' });
      return;
    }

    const credentials = { email: this.email.trim(), password: this.password.trim() }; /* object to send */

    this.authService.login(credentials).subscribe({ /* sends https and wait response */
      next: (res: any) => {
        Swal.fire({ icon: 'success', title: 'Login Successful', text: `Welcome, ${res.fullName || this.email}!`, confirmButtonColor: '#3085d6' })
          .then(() => {
            localStorage.setItem('role', res.role);
            localStorage.setItem('token', res.token);
            this.router.navigate(['/dashboard']);
          });
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
