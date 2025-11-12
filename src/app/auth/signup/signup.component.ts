import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = ''; // 'pharmacyOwner' or 'customer'

  private emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private router: Router, private authService: AuthService) {}

  onSignup(): void {
    // ===== VALIDATIONS =====
    if (!this.fullName.trim()) {
      Swal.fire({ icon: 'error', title: 'Full Name Missing', text: 'Please enter your full name!', confirmButtonColor: '#d33' });
      return;
    }

    if (!this.email.trim()) {
      Swal.fire({ icon: 'error', title: 'Email Missing', text: 'Please enter your email address!', confirmButtonColor: '#d33' });
      return;
    }

    if (!this.emailPattern.test(this.email)) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address!', confirmButtonColor: '#d33' });
      return;
    }

    if (!this.password) {
      Swal.fire({ icon: 'error', title: 'Password Missing', text: 'Please enter your password!', confirmButtonColor: '#d33' });
      return;
    }

    if (this.password.length < 8) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Password must be at least 8 characters long!', confirmButtonColor: '#d33' });
      return;
    }

    if (!this.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Confirm Password Missing', text: 'Please confirm your password!', confirmButtonColor: '#d33' });
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match!', confirmButtonColor: '#d33' });
      return;
    }

    if (!this.role) {
      Swal.fire({ icon: 'error', title: 'Role Not Selected', text: 'Please select a role!', confirmButtonColor: '#d33' });
      return;
    }

    // ===== PREPARE DATA =====
    const user = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role
    };

    // ===== SEND DATA TO BACKEND =====
    this.authService.signup(user).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful',
          text: `Welcome, ${res.fullName || this.fullName}!`,
          confirmButtonColor: '#3085d6'
        }).then(() => {
        
          if (user.role.toLowerCase() === 'pharmacyowner') {
            this.router.navigate(['/login']); // or your pharmacy owner details page
          } else {
            this.router.navigate(['/login']); // customers go to login
          }
        });
      },
      error: (err: any) => {
        const errorMessage =
          err?.error?.message ||
          err?.error ||
          err?.statusText ||
          'An unknown error occurred. Please check the server logs.';

        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: errorMessage,
          confirmButtonColor: '#d33'
        });

        console.error('Signup Error Details:', err);
      }
    });
  }
}
