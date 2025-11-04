import { Component } from '@angular/core';
import { ManagestockComponent } from '../managestock/managestock.component'; // Import standalone component
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ownerhome',
  templateUrl: './ownerhome.component.html',
  styleUrls: ['./ownerhome.component.css'],
  standalone: true, // Make ownerhome standalone too
  imports: [CommonModule, ManagestockComponent] // Import ManagestockComponent here
})
export class OwnerhomeComponent {
  sidebarClosed = false;
  activePage: string = 'dashboard';
}
