import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-students',
  imports: [CommonModule],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  students = [
  { name: 'Rahul', course: 'Angular Fundamentals', status: 'Pending' },
  { name: 'Sneha', course: 'Java Basics', status: 'Active' },
  { name: 'Amit', course: 'Angular Fundamentals', status: 'Completed' }
];
 
approve(student: any) {
  student.status = 'Active';
}


reject(student: any) {
  student.status = 'Rejected';
}

}
