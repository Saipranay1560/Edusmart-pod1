import { Injectable } from '@angular/core';
@Injectable({
 providedIn: 'root'
})
export class AuthService {
 private user = {
   name: 'Admin User',
   email: 'admin@edusmart.com',
   role: 'Administrator'
 };
 getUser() {
   return this.user;
 }
 logout() {
   alert('Logged out successfully');
 }
}