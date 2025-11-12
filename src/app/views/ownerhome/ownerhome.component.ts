import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagestockComponent } from '../managestock/managestock.component';
import { Router } from '@angular/router';
import { ProductaddformComponent } from '../../auth/signup/productaddform/productaddform.component'; // Replace with actual Add Pharmacy component

@Component({
  selector: 'app-ownerhome',
  templateUrl: './ownerhome.component.html',
  styleUrls: ['./ownerhome.component.css'],
  standalone: true,
  imports: [CommonModule, ManagestockComponent, ProductaddformComponent] 
})
export class OwnerhomeComponent {
  sidebarClosed = false;
  activePage: string = 'managestock';
  userFullName: string = 'Guest';
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get the logged-in user's full name from localStorage
    this.userFullName = localStorage.getItem('fullName') || 'Guest';
  }

  navigateTo(page: string) {
    this.activePage = page;
  }

  logout() {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
