import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Blocked';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Correct API endpoint (matches controller)
  private apiUrl = 'http://localhost:5170/api/auth'; 

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Update user status (Accept/Reject)
  updateUserStatus(id: number, status: 'Active' | 'Blocked'): Observable<any> {
    return this.http.put(`${this.apiUrl}/status/${id}`, { status });
  }

  // Optional: Remove a user
  removeUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Optional: Add new user
  addUser(user: Partial<User>): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, user);
  }
}
