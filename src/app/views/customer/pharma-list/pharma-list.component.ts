import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pharma-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pharma-list.component.html',
  styleUrls: ['./pharma-list.component.css']
})
export class PharmaListComponent {
  searchTerm: string = '';

  pharmacies = [
    { name: 'Green Pharmacy', contact: '+251911123456', image: 'assets/images/pharma1.jpg' },
    { name: 'Health Plus', contact: '+251911654321', image: 'assets/images/pharma2.jpg' },
    { name: 'Wellness Pharmacy', contact: '+251911987654', image: 'assets/images/pharma3.jpg' },
    { name: 'Sunrise Pharmacy', contact: '+251911112233', image: 'assets/images/pharma1.jpg' },
    { name: 'Medico Care', contact: '+251911445566', image: 'assets/images/me.jpg' },
    { name: 'LifePlus Pharmacy', contact: '+251911778899', image: 'assets/images/logo.png' }
  ];

  get filteredPharmacies() {
    if (!this.searchTerm) return this.pharmacies;
    return this.pharmacies.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.contact.includes(this.searchTerm)
    );
  }
}
