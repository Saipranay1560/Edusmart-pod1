import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';


interface Course {
 id: number;
 title: string;
 category: string;
 instructor: string;
 duration: string;
 description: string;
 status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

@Component({

  selector: 'app-courses',

  standalone: true,

  imports: [CommonModule,FormsModule,RouterModule],

  templateUrl: './courses.html',

  styleUrls: ['./courses.css']

})

export class CoursesComponent {

    courses: Course[] = [
   {
     id: 1,
     title: 'Angular Fundamentals',
     category: 'Programming',
     instructor: 'Rajinikanth',
     duration: '8 weeks',
     description: 'Learn Angular from basics to advanced.',
     status: 'PENDING'
   },
   {
     id: 2,
     title: 'Data Structures',
     category: 'Computer Science',
     instructor: 'Suresh',
     duration: '6 weeks',
     description: 'Core DS concepts with examples.',
     status: 'PENDING'
   }
 ];
 approveCourse(course: Course) {
   course.status = 'APPROVED';
 }
 rejectCourse(course: Course) {
   course.status = 'REJECTED';
 }
}