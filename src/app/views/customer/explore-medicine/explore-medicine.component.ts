import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-explore-medicine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore-medicine.component.html',
  styleUrls: ['./explore-medicine.component.css']
})
export class ExploreMedicineComponent {
  searchTerm: string = '';
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedMedicine: any = null;

  categories = ['Pain Relief', 'Antibiotics', 'Vitamins', 'Allergy', 'Cold & Flu'];

  medicines = [
    {
      name: 'Paracetamol',
      category: 'Pain Relief',
      price: 5,
      pharmacy: 'GreenLife Pharmacy',
      location: 'Bole, Addis Ababa',
      contact: '+251 912 345 678',
      description: 'Used to relieve pain and reduce fever.',
      image: 'assets/images/paracetamol.jpg'
    },
    {
      name: 'Amoxicillin',
      category: 'Antibiotics',
      price: 15,
      pharmacy: 'WellCare Pharmacy',
      location: 'Piassa, Addis Ababa',
      contact: '+251 987 654 321',
      description: 'Antibiotic used for bacterial infections.',
      image: 'assets/images/amoxicillin.jpg'
    },
    {
      name: 'Vitamin C',
      category: 'Vitamins',
      price: 10,
      pharmacy: 'MediTrust Pharmacy',
      location: 'Kazanchis, Addis Ababa',
      contact: '+251 934 567 890',
      description: 'Boosts immunity and improves skin health.',
      image: 'assets/images/vitaminc.jpg'
    },
    {
      name: 'Cetirizine',
      category: 'Allergy',
      price: 8,
      pharmacy: 'CityPharm Pharmacy',
      location: 'CMC, Addis Ababa',
      contact: '+251 911 222 333',
      description: 'Used for allergy and hay fever relief.',
      image: 'assets/images/cetirizine.jpg'
    },
    {
      name: 'ColdCaps',
      category: 'Cold & Flu',
      price: 12,
      pharmacy: 'AddisPharma',
      location: 'Megenagna, Addis Ababa',
      contact: '+251 944 555 666',
      description: 'For relief from cold and flu symptoms.',
      image: 'assets/images/coldcaps.jpg'
    }
  ];

  filteredMedicines = [...this.medicines];

  filterMedicines() {
    this.filteredMedicines = this.medicines.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory ? med.category === this.selectedCategory : true;
      const matchesMinPrice = this.minPrice !== null ? med.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice !== null ? med.price <= this.maxPrice : true;
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }

  showDetails(medicine: any) {
    this.selectedMedicine = medicine;
  }

  closeDetails() {
    this.selectedMedicine = null;
  }
}
