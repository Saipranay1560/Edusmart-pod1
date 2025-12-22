import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [Navbar,CommonModule],
  templateUrl: './instructor.html',
  styleUrl: './instructor.css',
})
export class Instructor {
  courses = [
    'Angular Fundamentals',
    'Java Basics'
  ];
 
  students = [
    { name: 'Rahul', course: 'Angular Fundamentals', status: 'Active' },
    { name: 'Sneha', course: 'Java Basics', status: 'Active' },
    { name: 'Amit', course: 'Angular Fundamentals', status: 'Completed' }
  ];
  approveStudent(student: any) {
  student.status = 'Completed';
}
 removeStudent(index:number) {
   const confirmDelete = confirm('Are you sure you want to remove this student?');
 
  if (confirmDelete) {
    this.students.splice(index, 1);
  }
 }
}
