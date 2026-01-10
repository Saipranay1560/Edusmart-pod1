import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
 
interface Course {
  id: number;
  title: string;
  description: string;
  status: 'Draft' | 'Published' | 'Archived';
}
 
@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class Courses {
 
  courses: Course[] = [
    {
      id: 1,
      title: 'Angular Fundamentals',
      description: 'Basics of Angular framework',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Java Basics',
      description: 'Core Java concepts',
      status: 'Draft'
    }
  ];
 
  newCourse: Course = {
    id: 0,
    title: '',
    description: '',
    status: 'Draft'
  };
 
  addCourse() {
    if (!this.newCourse.title || !this.newCourse.description) return;
 
    this.courses.push({
      ...this.newCourse,
      id: this.courses.length + 1
    });
 
    this.newCourse = {
      id: 0,
      title: '',
      description: '',
      status: 'Draft'
    };
  }
 
  publishCourse(course: Course) {
    course.status = 'Published';
  }
 
  archiveCourse(course: Course) {
    course.status = 'Archived';
  }
}
