import { Injectable } from '@angular/core'; /* make service availalbe throughtout */
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/* da struc */
interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5167/api/auth'; // Backend URL

  constructor(private http: HttpClient) {} /* allow http request */

  // ===== SIGNUP =====
  signup(data: SignupData): Observable<any> {
    // Trim all inputs before sending
    const payload = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
      role: data.role
    };
    return this.http.post(`${this.apiUrl}/signup`, payload); /* send request */
  }

  // ===== LOGIN =====
  login(data: LoginData): Observable<any> {
    const payload = {
      email: data.email.trim(),
      password: data.password.trim()
    };
    return this.http.post(`${this.apiUrl}/login`, payload);
  }
  
}
