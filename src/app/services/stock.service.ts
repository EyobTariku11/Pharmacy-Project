import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// DTO for adding stock
export interface StockDto {
  product: string;
  category: string;
  quantity: number;
}

// Response from backend
export interface StockResponse {
  message: string;
  stock?: any;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:5170/api/Stock';

  constructor(private http: HttpClient) {}

  // Add Authorization header for requests
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Add stock
  addStock(stock: StockDto): Observable<StockResponse> {
    return this.http
      .post<StockResponse>(`${this.apiUrl}/add`, stock, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((err) => {
          console.error('Add stock error:', err);
          let message = 'Failed to add stock';
          if (err.error?.message) message = err.error.message;
          else if (err.error?.error) message = err.error.error;
          return throwError(() => new Error(message));
        })
      );
  }

  // Get all stocks for logged-in user
  getAllStocks(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((err) => {
          console.error('Load stocks error:', err);
          let message = 'Failed to load stocks';
          if (err.error?.message) message = err.error.message;
          else if (err.error?.error) message = err.error.error;
          return throwError(() => new Error(message));
        })
      );
  }

  deleteStock(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  
}
