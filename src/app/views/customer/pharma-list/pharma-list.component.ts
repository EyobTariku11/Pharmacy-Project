import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PharmacyService } from '../../../services/pharmacy.service';

interface Pharmacy {
  id: number;
  pharmacyName: string;
  address: string;
  phoneNumber: string;
  email?: string;
  description?: string;
}

@Component({
  selector: 'app-pharma-list',
  templateUrl: './pharma-list.component.html',
  styleUrls: ['./pharma-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PharmaListComponent implements OnInit {
  searchTerm: string = '';
  selectedPharmacy: Pharmacy | null = null;
  pharmacies: Pharmacy[] = [];

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.loadPharmacies();
  }

  loadPharmacies() {
    this.pharmacyService.getAllPharmacies().subscribe({
      next: (res: Pharmacy[]) => {
        this.pharmacies = res;
      },
      error: (err) => {
        console.error('Failed to load pharmacies:', err);
      }
    });
  }

  get filteredPharmacies() {
    const term = this.searchTerm.toLowerCase();
    return this.pharmacies.filter(p =>
      p.pharmacyName.toLowerCase().includes(term)
    );
  }

  showDetails(pharmacy: Pharmacy) {
    this.selectedPharmacy = pharmacy;
  }

  closeDetails() {
    this.selectedPharmacy = null;
  }
}
