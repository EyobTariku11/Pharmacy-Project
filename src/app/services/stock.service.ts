import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AddStockDto {
  product: string;
  category: string;
  quantity: number;
  userId: number; // send user ID
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'https://localhost:5170/api/Stock'; // your backend URL

  constructor(private http: HttpClient) { }

  addStock(stock: AddStockDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/addStock`, stock);
  }
}
