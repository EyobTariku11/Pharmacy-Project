import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // For ngModel
import { CommonModule } from '@angular/common';

interface Pharmacy {
  name: string;
  contact: string;
  address: string;
  hours: string;
  image: string;
}

@Component({
  selector: 'app-pharma-list',
  templateUrl: './pharma-list.component.html',
  styleUrls: ['./pharma-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PharmaListComponent {
  searchTerm: string = '';
  selectedPharmacy: Pharmacy | null = null;

  pharmacies: Pharmacy[] = [
    { name: 'Green Pharmacy', address: '123 Main St', hours: '8AM-8PM', contact: '+251911123456', image: 'assets/images/pharma1.jpg' },
    { name: 'Health Plus', address: '456 Second Ave', hours: '9AM-7PM', contact: '+251911654321', image: 'assets/images/pharma2.jpg' },
    { name: 'Wellness Pharmacy', address: '789 Third Blvd', hours: '7AM-9PM', contact: '+251911987654', image: 'assets/images/logo.png' },
  ];

  get filteredPharmacies() {
    return this.pharmacies.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  showDetails(pharmacy: Pharmacy) {
    this.selectedPharmacy = pharmacy;
  }

  closeDetails() {
    this.selectedPharmacy = null;
  }
}
