import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmaListComponent } from '../customer/pharma-list/pharma-list.component'; // Import standalone component

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  standalone: true,
  imports: [CommonModule, PharmaListComponent] // Only CommonModule is needed for *ngIf, *ngFor, etc.
})
export class CustomerComponent {
  sidebarClosed = false; // Controls sidebar toggle
  activePage: string = 'customerlist'; // Default content for now
}
