import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css']
})
export class Student {
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
