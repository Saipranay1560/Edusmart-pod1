import { Injectable } from '@angular/core';
@Injectable({
 providedIn: 'root'
})
export class AuthService {
  // Save user info to localStorage after login/signup elsewhere in your app

  getUser() {
    // Try to get user from localStorage (set after login/signup)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('Logged out successfully');
  }
}