import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { StockService, StockDto } from '../../services/stock.service';

interface Stock {
  id?: number;            // <-- add this
  product: string;
  category: string;
  quantity: number | null;
  createdAt?: string;
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
  newStock: Stock = { product: '', category: '', quantity: null };
  stockList: Stock[] = [];

  constructor(private stockService: StockService) {
    this.loadStocks();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addStock() {
    if (!this.newStock.product || !this.newStock.category || this.newStock.quantity === null) {
      Swal.fire('Missing Fields', 'Please fill in all fields!', 'error');
      return;
    }

    const dto: StockDto = {
      product: this.newStock.product,
      category: this.newStock.category,
      quantity: this.newStock.quantity
    };

    this.stockService.addStock(dto).subscribe({
      next: (res) => {
        this.loadStocks();
        this.newStock = { product: '', category: '', quantity: null };
        this.showForm = false;
        Swal.fire('Success', res.message, 'success');
      },
      error: (err: any) => {
        Swal.fire('Error', err.message || 'Failed to add stock', 'error');
      }
    });
  }

  cancel() {
    this.showForm = false;
    this.newStock = { product: '', category: '', quantity: null };
  }

  deleteStock(stock: Stock, index: number) {
    if (!stock.id) {
      Swal.fire('Error', 'Stock ID not found', 'error');
      return;
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: "This stock item will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.stockService.deleteStock(stock.id!).subscribe({ // <-- send number
          next: () => {
            this.stockList.splice(index, 1);
            Swal.fire('Deleted!', 'The stock item has been deleted.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', err.error?.message || 'Failed to delete stock', 'error');
          }
        });
      }
    });
  }
  
  

  get filteredStock() {
    return this.stockList.filter(stock =>
      (stock.product?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      stock.category?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  // Determine stock status
  getStockStatus(stock: Stock): { text: string, className: string } {
    if (stock.quantity === null) return { text: '-', className: '' };
    if (stock.quantity <= 5) return { text: 'Low Stock', className: 'low' };
    if (stock.quantity <= 15) return { text: 'Critical Stock', className: 'critical' };
    return { text: 'Good Stock', className: 'good' };
  }

  loadStocks() {
    this.stockService.getAllStocks().subscribe({
      next: (res: any[]) => {
        this.stockList = res.map(s => ({
          id: s.id,                 // <-- store database Id
          product: s.product,
          category: s.category,
          quantity: s.quantity,
          createdAt: new Date(s.createdAt).toLocaleString()
        }));
      },
      error: (err) => {
        console.error('Load stocks error:', err);
        Swal.fire('Error', err?.error?.message || 'Failed to load stocks', 'error');
      }
    });
  }
  
  
}
