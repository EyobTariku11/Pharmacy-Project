import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Simulated login function
  login(email: string, password: string): boolean {
    console.log('Logging in with:', email, password);
    // For now, just return true for testing
    return true;
  }

  // Simulated signup function
  signup(name: string, email: string, password: string): boolean {
    console.log('Signing up with:', name, email, password);
    // For now, just return true for testing
    return true;
  }
}
