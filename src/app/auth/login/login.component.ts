import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  // Email regex for basic validation
  private emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  onLogin() {
    // Check if fields are empty
    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in both email and password!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Validate email format
    if (!this.emailPattern.test(this.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // If all validations pass
    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: `Welcome, ${this.email}!`,
      confirmButtonColor: '#3085d6'
    });

    console.log('Email:', this.email);
    console.log('Password:', this.password);

    // You can add backend login logic here later
  }
}
