import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmaListComponent } from '../customer/pharma-list/pharma-list.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  standalone: true,
  imports: [CommonModule, PharmaListComponent] // Now works because PharmaListComponent is standalone
})
export class CustomerComponent {
  sidebarClosed = false;
  activePage: string = 'customerlist';
}
