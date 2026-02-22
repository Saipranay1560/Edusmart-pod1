import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course';
import { Course } from '../../models/courses';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class Courses implements OnInit {
  courses: Course[] = [];
  newCourse: Course = {
    id: 0,
    name: '',
    description: '',
    status: 'Pending'
  };
  showCreateModal: boolean = false;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.courses = courses;
    });
  }

  getInstructorId(): number {
    const userStr = localStorage.getItem('user');
    if (!userStr) return 0;
    try {
      const user = JSON.parse(userStr);
      return user.id || 0;
    } catch {
      return 0;
    }
  }

  addCourse() {
    if (!this.newCourse.name || !this.newCourse.description) return;
    const courseData = {
      name: this.newCourse.name,
      description: this.newCourse.description,
      status: this.newCourse.status,
      instructorId: this.getInstructorId()
    };
    this.courseService.addCourse(courseData).subscribe({
      next: () => {
        this.newCourse = {
          id: 0,
          name: '',
          description: '',
          status: 'Pending'
        };
        this.closeNewCourse();
        this.loadCourses();
      }
    });
  }

  openNewCourse() {
    this.showCreateModal = true;
  }

  closeNewCourse() {
    this.showCreateModal = false;
  }

  publishCourse(course: Course) {
    this.courseService.publishCourse(course).subscribe(() => {
      this.loadCourses();
    });
  }

  archiveCourse(course: Course) {
    this.courseService.archiveCourse(course).subscribe(() => {
      this.loadCourses();
    });
  }
}
