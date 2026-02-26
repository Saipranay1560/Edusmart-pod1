import { Component, OnInit, signal } from '@angular/core';
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
  courses = signal<Course[]>([]);
  newCourse = signal<Course>({
    id: 0,
    name: '',
    description: '',
    status: 'Pending'
  });
  showCreateModal = signal<boolean>(false);

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.courses.set(courses);
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
    const currentCourse = this.newCourse();
    if (!currentCourse.name || !currentCourse.description) return;
    const courseData = {
      name: currentCourse.name,
      description: currentCourse.description,
      status: currentCourse.status,
      instructorId: this.getInstructorId()
    };
    this.courseService.addCourse(courseData).subscribe({
      next: () => {
        this.newCourse.set({
          id: 0,
          name: '',
          description: '',
          status: 'Pending'
        });
        this.closeNewCourse();
        this.loadCourses();
      }
    });
  }
  openNewCourse() {
    this.showCreateModal.set(true);
  }

  closeNewCourse() {
    this.showCreateModal.set(false);
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
