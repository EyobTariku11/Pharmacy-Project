import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { StockService, AddStockDto } from '../../services/stock.service';

interface Stock {
  product: string;
  category: string;
  quantity: number | null;
  status: string;
}

@Component({
  selector: 'app-managestock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './managestock.component.html',
  styleUrls: ['./managestock.component.css']
})
export class ManagestockComponent {
  showForm = false;
  searchTerm: string = '';

  newStock: Stock = { product: '', category: '', quantity: null, status: 'Active' };

  stockList: Stock[] = [];

  // Simulate logged-in user ID
  userId = 1;

  constructor(private stockService: StockService) { }

  toggleForm() {
    this.showForm = !this.showForm;
  }

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

    if (this.newStock.quantity === 0) this.newStock.status = 'Out of Stock';
    else if (this.newStock.quantity < 20) this.newStock.status = 'Low';
    else this.newStock.status = 'Active';

    const dto: AddStockDto = {
      product: this.newStock.product,
      category: this.newStock.category,
      quantity: this.newStock.quantity!,
      userId: this.userId
    };

    this.stockService.addStock(dto).subscribe({
      next: (res) => {
        this.stockList.push({ ...this.newStock });
        this.newStock = { product: '', category: '', quantity: null, status: 'Active' };
        this.showForm = false;

        Swal.fire({
          icon: 'success',
          title: 'Stock Added',
          text: 'New stock has been successfully added!',
          confirmButtonColor: '#1f8c4d'
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add stock. Please try again.',
          confirmButtonColor: '#d33'
        });
        console.error(err);
      }
    });
  }

  cancel() {
    this.showForm = false;
    this.newStock = { product: '', category: '', quantity: null, status: 'Active' };
  }

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
    }).then(result => {
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

  get filteredStock() {
    return this.stockList.filter(stock =>
      stock.product.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      stock.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
