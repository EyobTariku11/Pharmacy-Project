import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacyControlComponent } from './pharmacy-control/pharmacy-control.component'; // import the component
import { SystemActivityComponent } from './system-activity/system-activity.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, PharmacyControlComponent,SystemActivityComponent,UserManagementComponent], // add it here
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  sidebarClosed: boolean = false;
  activePage: string = 'pharmacyManagement';
  constructor(private router: Router) {}  
  
  logout() {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
