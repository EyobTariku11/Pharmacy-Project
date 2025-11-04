import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productaddform',
  templateUrl: './productaddform.component.html',
  styleUrls: ['./productaddform.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductaddformComponent {
  organizationName: string = '';
  address: string = '';
  contact: string = '';
  license: string = '';
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  // Handle image selection with proper typing
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedImage = input.files[0];

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedImage);
  }

  // Form submission
  onSubmit(): void {
    // Validation
    if (!this.organizationName.trim()) {
      Swal.fire('Error', 'Organization Name is required', 'error');
      return;
    }
    if (!this.address.trim()) {
      Swal.fire('Error', 'Address is required', 'error');
      return;
    }
    if (!this.contact.trim()) {
      Swal.fire('Error', 'Contact Info is required', 'error');
      return;
    }
    if (!this.license.trim()) {
      Swal.fire('Error', 'License Number is required', 'error');
      return;
    }
    if (!this.selectedImage) {
      Swal.fire('Error', 'Organization Image is required', 'error');
      return;
    }

    // All validations passed
    Swal.fire('Success', 'Details saved successfully!', 'success');

    console.log('Organization Name:', this.organizationName);
    console.log('Address:', this.address);
    console.log('Contact Info:', this.contact);
    console.log('License Number:', this.license);
    console.log('Selected Image:', this.selectedImage);
  }
}
