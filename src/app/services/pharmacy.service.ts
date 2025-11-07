import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private apiUrl = 'http://localhost:5170/api/pharmacy';

  constructor(private http: HttpClient) {}

  addPharmacy(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  getAllPharmacies(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
}
