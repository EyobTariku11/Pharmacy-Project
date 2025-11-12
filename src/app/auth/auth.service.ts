import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';

export interface SignupData { fullName: string; email: string; password: string; role?: string; }
export interface LoginData { email: string; password: string; }
export interface AuthResponse { message: string; fullName: string; role: string; token: string; status: 'Active' | 'Pending' | 'Blocked'; email?: string; }
export interface StatusResponse { status: 'Active' | 'Pending' | 'Blocked'; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5170/api/auth';
  private hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) {}

  // ===== SIGNALR SETUP =====
  startSignalR(email: string, onStatusChange: (status: string) => void) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5170/userStatusHub?user=${email}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.error('SignalR connection error', err));

    this.hubConnection.on('ReceiveStatusUpdate', (status: string) => {
      onStatusChange(status);
    });
  }

  stopSignalR() {
    this.hubConnection?.stop().catch(err => console.error(err));
  }

  // ===== SIGNUP =====
  signup(data: SignupData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
      role: data.role
    });
  }

  // ===== LOGIN =====
  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email: data.email.trim(),
      password: data.password.trim()
    });
  }

  // ===== CHECK USER STATUS (polling fallback) =====
  checkUserStatus(email: string): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.apiUrl}/status/${email}`);
  }

  // ===== TOKEN MANAGEMENT =====
  getToken(): string | null { return localStorage.getItem('token'); }
  getRole(): string | null { return localStorage.getItem('role'); }
  getEmail(): string | null { return localStorage.getItem('email'); }
  isLoggedIn(): boolean { return !!this.getToken(); }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('fullName');
    this.stopSignalR();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }) : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  storeLoginInfo(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('email', res.email || '');
    localStorage.setItem('fullName', res.fullName || '');
  }
}
