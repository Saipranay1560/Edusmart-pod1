import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
 Router,
 RouterLink,
 RouterLinkActive,
 RouterOutlet
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
 selector: 'app-admin',
 standalone: true,
 imports: [
   CommonModule,
   FormsModule,
   RouterOutlet,
   RouterLink,
   RouterLinkActive
 ],
 templateUrl: './admin.html',
 styleUrls: ['./admin.css'],
 encapsulation: ViewEncapsulation.None
})
export class Admin {
 
 isSidebarOpen = true;
 isDropdownOpen = false;

 user: { name: string; email: string; role: string } | null = {
   name: 'RAJINIKANTH',
   email: 'demo@example.com',
   role: 'ADMIN'
 };
 constructor(
   private router: Router,
   private authService: AuthService
 ) {}
 
 toggleSidebar(): void {
   this.isSidebarOpen = !this.isSidebarOpen;
 }
 
 toggleDropdown(event: MouseEvent): void {
   event.stopPropagation();
   this.isDropdownOpen = !this.isDropdownOpen;
 }
 
 closeDropdown(): void {
   this.isDropdownOpen = false;
 }

 logout(): void {
   
   localStorage.clear();
   sessionStorage.clear();
  
   if (this.authService?.logout) {
     this.authService.logout();
   }
   
   this.router.navigate(['/login']);
 }
}