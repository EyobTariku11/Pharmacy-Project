import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PharmacyService } from '../../../services/pharmacy.service';
import Swal from 'sweetalert2';

interface Pharmacy {
  id: number;
  pharmacyName: string;
  licenseNumber: string;
  address: string;
  phoneNumber: string;
  email?: string;
  description?: string;
}

@Component({
  selector: 'app-pharmacy-control',
  templateUrl: './pharmacy-control.component.html',
  styleUrls: ['./pharmacy-control.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PharmacyControlComponent implements OnInit {
  searchTerm: string = '';
  pharmacies: Pharmacy[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.loadPharmacies();
  }

  loadPharmacies() {
    this.pharmacyService.getAllPharmacies().subscribe({
      next: (res: Pharmacy[]) => {
        this.pharmacies = res;
        this.totalPages = Math.ceil(this.filteredPharmacies.length / this.itemsPerPage);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load pharmacies',
          text: err.message || 'Unknown error'
        });
        console.error('Failed to load pharmacies:', err);
      }
    });
  }

  get filteredPharmacies() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.pharmacies.filter(p =>
      p.pharmacyName.toLowerCase().includes(term)
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  removePharmacy(pharmacy: Pharmacy) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove ${pharmacy.pharmacyName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pharmacyService.removePharmacy(pharmacy.id).subscribe({
          next: () => {
            this.pharmacies = this.pharmacies.filter(p => p.id !== pharmacy.id);
            Swal.fire('Removed!', `${pharmacy.pharmacyName} has been removed.`, 'success');
          },
          error: (err) => {
            Swal.fire('Error!', err.message || 'Failed to remove pharmacy', 'error');
          }
        });
      }
    });
  }
}
