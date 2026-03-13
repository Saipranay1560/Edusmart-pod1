import { Component, OnInit } from '@angular/core';
import { EnrollmentService, EnrollmentResponse } from '../../../services/enrolladmin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollment',
  standalone: true, // Ensuring standalone if needed
  imports: [FormsModule, CommonModule],
  templateUrl: './enrollments.html',
  styleUrls: ['./enrollments.css']
})
export class EnrollmentComponent implements OnInit {
  enrollments: EnrollmentResponse[] = [];
  filteredEnrollments: EnrollmentResponse[] = []; // Array to show in the table
  searchTerm: string = ''; 

  // Dashboard Stats
  totalEnrollments: number = 0;
  activeCount: number = 0;
  completedCount: number = 0;

  constructor(private enrollmentService: EnrollmentService) { }

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        console.log('Enrollments loaded:', data);
        this.enrollments = data;
        this.filteredEnrollments = data; // Initially, show all
        this.calculateStats();
      },
      error: (err) => console.error('Failed to load enrollments', err)
    });
  }

  // This function triggers every time the user types
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredEnrollments = this.enrollments;
    } else {
      this.filteredEnrollments = this.enrollments.filter(e => 
        e.studentName.toLowerCase().includes(term) || 
        e.courseName.toLowerCase().includes(term)
      );
    }
  }

  calculateStats(): void {
    this.totalEnrollments = this.enrollments.length;
    this.activeCount = this.enrollments.filter(e => e.status === 'Active').length;
    this.completedCount = this.enrollments.filter(e => e.status === 'Completed').length;
  }
}