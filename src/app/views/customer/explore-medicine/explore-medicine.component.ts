import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, Stock } from '../../../services/stock.service';

@Component({
  selector: 'app-explore-medicine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore-medicine.component.html',
  styleUrls: ['./explore-medicine.component.css']
})
export class ExploreMedicineComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedMedicine: Stock | null = null;

  categories: string[] = [];
  medicines: Stock[] = [];
  filteredMedicines: Stock[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines() {
    this.stockService.getAllStocksPublic().subscribe({
      next: (res: Stock[]) => {
        this.medicines = res;

        // Extract unique categories
        this.categories = Array.from(new Set(this.medicines.map(m => m.category)));

        this.filteredMedicines = [...this.medicines];
      },
      error: (err) => {
        console.error('Failed to load medicines:', err);
      }
    });
  }

  filterMedicines() {
    this.filteredMedicines = this.medicines.filter(med => {
      const matchesSearch = med.product.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory ? med.category === this.selectedCategory : true;
      const matchesMinPrice = this.minPrice !== null ? med.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice !== null ? med.price <= this.maxPrice : true;
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }

  showDetails(medicine: Stock) {
    this.selectedMedicine = medicine;
  }

  closeDetails() {
    this.selectedMedicine = null;
  }
}
