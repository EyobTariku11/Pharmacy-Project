import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-managestock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './managestock.component.html',
  styleUrls: ['./managestock.component.css']
})
export class ManagestockComponent {
  showForm = false;
  searchTerm: string = ''; // For search input

  newStock = {
    product: '',
    category: '',
    quantity: null
  };

  stockList = [
    { product: 'Paracetamol', category: 'Medicine', quantity: 120, status: 'Active' },
    { product: 'Vitamin C', category: 'Supplement', quantity: 15, status: 'Low' },
    { product: 'Insulin', category: 'Medicine', quantity: 0, status: 'Out of Stock' }
  ];

  // Toggle Add Stock form
  toggleForm() {
    this.showForm = !this.showForm;
  }

  // Add new stock with SweetAlert2 validation
  addStock() {
    if (!this.newStock.product || !this.newStock.category || this.newStock.quantity === null) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in all fields before adding stock!',
        confirmButtonColor: '#d33'
      });
      return;
    }

    let status = 'Active';
    if (this.newStock.quantity === 0) status = 'Out of Stock';
    else if (this.newStock.quantity < 20) status = 'Low';

    this.stockList.push({
      product: this.newStock.product,
      category: this.newStock.category,
      quantity: this.newStock.quantity,
      status
    });

    this.newStock = { product: '', category: '', quantity: null };
    this.showForm = false;

    Swal.fire({
      icon: 'success',
      title: 'Stock Added',
      text: 'New stock has been successfully added!',
      confirmButtonColor: '#1f8c4d'
    });
  }

  // Cancel Add Stock form
  cancel() {
    this.showForm = false;
  }

  // Delete stock with SweetAlert2 confirmation
  deleteStock(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This stock item will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1f8c4d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stockList.splice(index, 1);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The stock item has been deleted.',
          confirmButtonColor: '#1f8c4d'
        });
      }
    });
  }

  // Filter stock list based on search input
  get filteredStock() {
    return this.stockList.filter(stock => 
      stock.product.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      stock.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
