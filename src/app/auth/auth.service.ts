import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ===== Types =====
export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  fullName: string;
  role: string;
  token: string;
  email?: string; // optional, to store user email
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ✅ Update to your running backend URL
  private apiUrl = 'http://localhost:5170/api/auth';

  constructor(private http: HttpClient) {}

  // ===== SIGNUP =====
  signup(data: SignupData): Observable<AuthResponse> {
    const payload: SignupData = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
      role: data.role
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, payload);
  }

  // ===== LOGIN =====
  login(data: LoginData): Observable<AuthResponse> {
    const payload: LoginData = {
      email: data.email.trim(),
      password: data.password.trim()
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload);
  }

  // ===== TOKEN MANAGEMENT =====
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  }

  // ===== AUTH HEADERS =====
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token
      ? new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // ===== STORE LOGIN INFO =====
  storeLoginInfo(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    // store email if present, otherwise fallback to empty string
    localStorage.setItem('email', res.email || '');
  }
}
