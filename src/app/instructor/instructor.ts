import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterModule],
  templateUrl: './instructor.html',
  styleUrls: ['./instructor.css']
})
export class Instructor {

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

constructor(private router: Router) {}
  logout() {
    this.router.navigate(['/login']);
  }
}
