import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class Courses {
 
  courses = [
    {
      id: 1,
      title: 'Angular Fundamentals',
      subject: 'Angular',
      mode: 'Instructor-led',
      credits: 4,
      enrolled: false
    },
    {
      id: 2,
      title: 'Java Basics',
      subject: 'Java',
      mode: 'Self-paced',
      credits: 3,
      enrolled: true
    },
    {
      id: 3,
      title: 'Python for Beginners',
      subject: 'Python',
      mode: 'Self-paced',
      credits: 5,
      enrolled: false
    }
  ];
 
  toggleEnroll(course: any) {
    course.enrolled = !course.enrolled;
  }
}