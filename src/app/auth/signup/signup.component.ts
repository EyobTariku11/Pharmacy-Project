import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = ''; // 'pharmacyOwner' or 'customer'

  // Email regex for basic validation
  private emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  onSignup() {
    // Validate Full Name
    if (!this.fullName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Full Name Missing',
        text: 'Please enter your full name!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Validate Email
    if (!this.email.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Email Missing',
        text: 'Please enter your email address!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (!this.emailPattern.test(this.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Validate Password
    if (!this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Password Missing',
        text: 'Please enter your password!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (this.password.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 8 characters long!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Validate Confirm Password
    if (!this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Confirm Password Missing',
        text: 'Please confirm your password!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Validate Role
    if (!this.role) {
      Swal.fire({
        icon: 'error',
        title: 'Role Not Selected',
        text: 'Please select a role: Pharmacy Owner or Customer!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // If all validations pass
    Swal.fire({
      icon: 'success',
      title: 'Signup Successful',
      text: `Welcome, ${this.fullName}! Role: ${this.role}`,
      confirmButtonColor: '#3085d6'
    });

    console.log('Full Name:', this.fullName);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Selected Role:', this.role);

    // Add backend signup logic here later
  }
}
