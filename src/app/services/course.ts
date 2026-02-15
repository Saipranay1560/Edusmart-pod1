import { Injectable } from '@angular/core';
import { Course } from '../models/courses';
 
@Injectable({
  providedIn: 'root'
})
export class CourseService {
 
  private courses: Course[] = [
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
 
  getCourses(): Course[] {
    return this.courses;
  }

  getCourseById(id:number):Course | undefined {
    return this.courses.find(c => c.id === id);
  }
 
  addCourse(course: Course) {
    course.id = this.courses.length + 1;
    this.courses.push(course);
  }
 
  publishCourse(course: Course) {
    course.status = 'Published';
  }
 
  archiveCourse(course: Course) {
    course.status = 'Archived';
  }
}


