import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { StockService, StockDto } from '../../services/stock.service';

interface Stock {
  id?: number; 
  product: string;
  category: string;
  quantity: number | null;
  price: number | null,
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
  newStock: Stock = { product: '', category: '', quantity: null, price:null};
  stockList: Stock[] = [];

  // ✅ Pagination variables
  currentPage = 1;
  pageSize = 10;
  paginatedStock: Stock[] = [];
  totalPages = 0;
  totalPagesArray: number[] = [];

  constructor(private stockService: StockService) {
    this.loadStocks();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addStock() {
    if (!this.newStock.product || !this.newStock.category || this.newStock.quantity === null || this.newStock.price === null) {
      Swal.fire('Missing Fields', 'Please fill in all fields!', 'error');
      return;
    }

    const dto: StockDto = {
      product: this.newStock.product,
      category: this.newStock.category,
      quantity: this.newStock.quantity,
      price: this.newStock.price
    };

    this.stockService.addStock(dto).subscribe({
      next: (res) => {
        this.loadStocks();
        this.newStock = { product: '', category: '', quantity: null , price: null };
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
    this.newStock = { product: '', category: '', quantity: null , price: null };
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
        this.stockService.deleteStock(stock.id!).subscribe({
          next: () => {
            this.stockList.splice(index, 1);
            this.updatePagination();
            Swal.fire('Deleted!', 'The stock item has been deleted.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', err.error?.message || 'Failed to delete stock', 'error');
          }
        });
      }
    });
  }

  // ✅ Filtered list (search)
  get filteredStock() {
    const term = this.searchTerm.toLowerCase();

    const filtered = this.stockList.filter(stock =>
      stock.product?.toLowerCase().includes(term) ||
      stock.category?.toLowerCase().includes(term)
    );

    // update pagination when searching
    this.updatePagination(filtered);

    return filtered;
  }

  // ✅ Stock status colors + text
  getStockStatus(stock: Stock): { text: string, className: string } {
    if (stock.quantity === null) return { text: '-', className: '' };
    if (stock.quantity <= 5) return { text: 'Low Stock', className: 'low' };
    if (stock.quantity <= 15) return { text: 'Critical Stock', className: 'critical' };
    return { text: 'Good Stock', className: 'good' };
  }

  // ✅ Load all stocks
  loadStocks() {
    this.stockService.getMyStocks().subscribe({
      next: (res: any[]) => {
        this.stockList = res.map(s => ({
          id: s.id,
          product: s.product,
          category: s.category,
          quantity: s.quantity,
          price: s.price,
          createdAt: new Date(s.createdAt).toLocaleString()
        }));

        this.updatePagination();
      },
      error: (err) => {
        console.error('Load stocks error:', err);
        Swal.fire('Error', err?.error?.message || 'Failed to load stocks', 'error');
      }
    });
  }

  // ✅ Pagination logic
  updatePagination(filteredList?: Stock[]) {
    const list = filteredList || this.stockList;

    this.totalPages = Math.ceil(list.length / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedStock = list.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }
}
