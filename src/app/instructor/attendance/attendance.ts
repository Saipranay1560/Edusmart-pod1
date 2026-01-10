import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class Attendance {
 
  students = [
    { name: 'Rahul', status: 'Pending' },
    { name: 'Sneha', status: 'Pending' },
    { name: 'Amit', status: 'Pending' }
  ];
 
  markPresent(student: any) {
    student.status = 'Present';
  }
 
  markAbsent(student: any) {
    student.status = 'Absent';
  }
}