import { Component, OnInit } from '@angular/core';
import { EnrollmentService, EnrollmentResponse } from '../../../services/enrolladmin';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollment',
  imports: [FormsModule,CommonModule],
  templateUrl: './enrollments.html',
  styleUrls: ['./enrollments.css']
})
export class EnrollmentComponent implements OnInit {
  enrollments: EnrollmentResponse[] = [];
  
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
        this.calculateStats();
      },
      error: (err) => console.error('Failed to load enrollments', err)
    });
  }

  calculateStats(): void {
    this.totalEnrollments = this.enrollments.length;
    this.activeCount = this.enrollments.filter(e => e.status === 'Active').length;
    this.completedCount = this.enrollments.filter(e => e.status === 'Completed').length;
  }
}