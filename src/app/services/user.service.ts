import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// User interface
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
  // Base API endpoint
  private apiUrl = 'http://localhost:5170/api/auth'; 

  constructor(private http: HttpClient) {}

  // -------------------- GET ALL USERS --------------------
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // -------------------- UPDATE USER STATUS --------------------
  updateUserStatus(id: number, status: 'Active' | 'Blocked'): Observable<User> {
    // API should return updated user object
    return this.http.put<User>(`${this.apiUrl}/status/${id}`, { status });
  }

  // -------------------- DELETE USER --------------------
  removeUser(id: number): Observable<{ message: string }> {
    // API should return a message confirming deletion
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${id}`);
  }

  // -------------------- ADD NEW USER --------------------
  addUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/add`, user);
  }
}
