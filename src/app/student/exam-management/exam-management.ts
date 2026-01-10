import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-management.html',
  styleUrls: ['./exam-management.css']
})
export class ExamManagement {
 
  exams = [
    {
      id: 1,
      subject: 'Angular Fundamentals',
      examName: 'Mid Term Exam',
      date: '2026-02-10',
      duration: '90 mins',
      status: 'Upcoming'
    },
    {
      id: 2,
      subject: 'Java Basics',
      examName: 'Final Exam',
      date: '2026-01-25',
      duration: '120 mins',
      status: 'Completed'
    },
    {
      id: 3,
      subject: 'Python for Beginners',
      examName: 'Weekly Test',
      date: '2026-01-15',
      duration: '60 mins',
      status: 'Completed'
    }
  ];
 
}
