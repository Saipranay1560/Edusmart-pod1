import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile.html',
  styleUrls: ['./student-profile.css']
})
export class StudentProfile {
 
  student = {
    name: 'Rahul',
    rollNo: 'STU101',
    email: 'rahul@student.com',
    phone: '+91 9876543210',
    department: 'Computer Science',
    year: 'Final Year',
    college: 'EduSmart University'
  };
 
}