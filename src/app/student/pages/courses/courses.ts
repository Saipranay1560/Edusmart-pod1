
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data';
import { Course, Subject } from '../../shared';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class Courses {
  subjects: Subject[] = [];
  courses: Course[] = [];
  subjectNameById: Record<string, string> = {};

  constructor(private data: DataService) {
    this.subjects = data.getSubjects();
    this.subjectNameById = this.subjects.reduce((acc, s) => {
      acc[s.id] = s.name;
      return acc;
    }, {} as Record<string, string>);

    this.refreshCourses();
  }

  toggleEnroll(course: Course) {
    this.data.toggleEnroll(course.id, !course.enrolled);
    this.refreshCourses();
  }

  private refreshCourses() {
    this.courses = this.subjects.flatMap(s => this.data.getCoursesBySubject(s.id));
  }
}
