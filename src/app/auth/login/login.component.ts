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
    // ===== Validation =====
    if (!this.email.trim() || !this.password.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in both email and password!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (!this.emailPattern.test(this.email.trim())) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const credentials: LoginData = {
      email: this.email.trim(),
      password: this.password.trim()
    };

    // ===== Call backend =====
    this.authService.login(credentials).subscribe({
      next: (res: AuthResponse) => {
        // ✅ Store token, role, and fullName
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('fullName', res.fullName || this.email);

        // ===== Navigation based on role =====
        const normalizedRole = res.role.replace(/\s+/g, '').toLowerCase();
        if (normalizedRole === 'pharmacyowner') {
          this.router.navigate(['/ownerhome']);
        } else if (normalizedRole === 'customer') {
          this.router.navigate(['/customer']);
        } else if (normalizedRole === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/landing']); // fallback
        }

        // ✅ Optional success alert
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome, ${res.fullName || this.email}!`,
          confirmButtonColor: '#3085d6'
        });
      },
      error: (err: any) => {
        let msg = 'An unexpected error occurred during login.';
        if (err.status === 401) msg = err.error?.message || 'Invalid email or password';
        else if (err.status === 400) msg = err.error?.message || 'Bad request';
        else if (err.error?.message) msg = err.error.message;

        Swal.fire({ 
          icon: 'error', 
          title: 'Login Failed', 
          text: msg, 
          confirmButtonColor: '#d33' 
        });
        console.error('Login error details:', err);
      }
    });
  }
}
