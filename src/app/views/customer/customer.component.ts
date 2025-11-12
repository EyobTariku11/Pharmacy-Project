import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PharmaListComponent } from '../customer/pharma-list/pharma-list.component';
import { ExploreMedicineComponent } from '../customer/explore-medicine/explore-medicine.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  standalone: true,
  imports: [CommonModule, PharmaListComponent, ExploreMedicineComponent]
})
export class CustomerComponent implements OnInit {
  sidebarClosed = false;
  activePage: string = 'customerlist';
  userFullName: string = 'Guest';

  // ✅ Inject Router
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get the logged-in user's full name from localStorage
    this.userFullName = localStorage.getItem('fullName') || 'Guest';
  }

  logout() {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}

