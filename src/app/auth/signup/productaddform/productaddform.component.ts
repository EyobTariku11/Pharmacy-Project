import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PharmacyService } from '../../../services/pharmacy.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-productaddform',
  templateUrl: './productaddform.component.html',
  styleUrls: ['./productaddform.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductaddformComponent {
  pharmacyName: string = '';
  address: string = '';
  contact: string = '';
  license: string = '';
  email: string = '';
  description: string = '';

  constructor(
    private pharmacyService: PharmacyService,
    private router: Router // Inject Router
  ) {}

  onSubmit(): void {
    if (!this.pharmacyName || !this.address || !this.contact || !this.license || !this.email) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }

    const data = {
      PharmacyName: this.pharmacyName,
      Address: this.address,
      PhoneNumber: this.contact,
      LicenseNumber: this.license,
      Email: this.email,
      Description: this.description
    };

    this.pharmacyService.addPharmacy(data).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Details saved successfully!', 'success').then(() => {
          // Navigate to owner page after success
          this.router.navigate(['/ownerhome']); 
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to save details', 'error');
      }
    });
  }
}
