import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
 
@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class Student {
 
  courses = [
    {
      name: 'Angular Fundamentals',
      instructor: 'John',
      duration: '6 weeks',
      enrolled: false
    },
    {
      name: 'Java Basics',
      instructor: 'Smith',
      duration: '8 weeks',
      enrolled: false
    },
    {
      name: 'Python for Beginners',
      instructor: 'Alice',
      duration: '5 weeks',
      enrolled: false
    }
  ];
 
  enroll(course: any) {
    course.enrolled=true;
    alert(`Successfully enrolled in ${course.name}`);
  }
}
