import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// DTO for adding/updating stock
export interface StockDto {
  product: string;
  category: string;
  quantity: number;
  price: number;
}

// Stock entity from database
export interface Stock {
  id: number;
  product: string;
  category: string;
  quantity: number;
  price: number;
  userId: number;
  userName: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:5170/api/Stock';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addStock(stock: StockDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, stock, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error('Add stock error:', err);
          let message = 'Failed to add stock';
          if (err.error?.message) message = err.error.message;
          else if (err.error?.error) message = err.error.error;
          return throwError(() => new Error(message));
        })
      );
  }

  updateStock(id: number, stock: StockDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, stock, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error('Update stock error:', err);
          let message = 'Failed to update stock';
          if (err.error?.message) message = err.error.message;
          else if (err.error?.error) message = err.error.error;
          return throwError(() => new Error(message));
        })
      );
  }

  getAllStocksPublic(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/all`)
      .pipe(
        catchError(err => {
          console.error('Load stocks error:', err);
          let message = 'Failed to load stocks';
          if (err.error?.message) message = err.error.message;
          else if (err.error?.error) message = err.error.error;
          return throwError(() => new Error(message));
        })
      );
  }

  getMyStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error('Load my stocks error:', err);
          return throwError(() => new Error('Failed to load user stocks'));
        })
      );
  }

  deleteStock(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
  }
}
