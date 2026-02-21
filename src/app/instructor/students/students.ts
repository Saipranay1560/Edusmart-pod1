import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-students',
  imports: [CommonModule],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students implements OnInit {
  students = signal<any[]>([]);

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit() {
    this.enrollmentService.getPendingEnrollments().subscribe(
      (data) => this.students.set(data || []),
      (err) => this.students.set([])
    );
  }

  approve(student: any) {
    // TODO: Call backend to approve enrollment
    student.status = 'Active';
  }

  reject(student: any) {
    // TODO: Call backend to reject enrollment
    student.status = 'Rejected';
  }
}
