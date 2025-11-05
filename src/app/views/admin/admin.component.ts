import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf, *ngFor, etc.

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'] // fixed typo here
})
export class AdminComponent {
  // Controls whether the sidebar is open or closed
  sidebarClosed: boolean = false;

  // Tracks which page/feature is currently active
  activePage: string = 'pharmacyManagement'; // default page
}
