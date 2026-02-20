import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService, Course } from '../../../services/course-service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class CoursesComponent implements OnInit {
  constructor(private courseService: CourseService) {}

  // expose courses to template as a getter so template can use `courses`
  get courses() {
    return this.courseService.courses();
  }

  ngOnInit(): void {
    // ensure data is loaded (service loads on construction but call again if needed)
    this.courseService.loadAll();
  }

  approveCourse(course: Course) {
    this.courseService.updateStatus(course.id, 'APPROVED').subscribe();
  }

  rejectCourse(course: Course) {
    this.courseService.updateStatus(course.id, 'REJECTED').subscribe();
  }
}