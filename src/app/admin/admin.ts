import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
 
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
 
  users = [
    { name: 'Rahul', role: 'Student', status: 'Active' },
    { name: 'Anita', role: 'Instructor', status: 'Active' },
    { name: 'Admin', role: 'Admin', status: 'Active' }
  ];
 
  courses = [
    'Angular Fundamentals',
    'Java Basics',
    'Python for Beginners'
  ];
  
removeUser(index: number) {
  const confirmDelete = confirm('Are you sure you want to remove this user?');
 
  if (confirmDelete) {
    this.users.splice(index, 1);
  }
}
}
