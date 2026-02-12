import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data';
import { Course, Subject, OverallProgress } from '../../shared';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class Courses implements OnInit {
  availableCourses: Course[] = [];
  enrolledSubjects: any[] = [];
  overall?: OverallProgress;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.refreshDashboard();
  }

  // Inside Courses Component
refreshDashboard() {
  this.overall = this.data.getOverallProgress();

  const allCourses = this.data.getSubjects().flatMap(s => this.data.getCoursesBySubject(s.id));


  this.availableCourses = allCourses.filter(c => !c.enrolled);

const enrolledIds = new Set(this.data.getSubjects().map(s => s.id));

  this.enrolledSubjects = this.data.getSubjects()
    .filter(s => enrolledIds.has(s.id))
    .map(subject => ({
      ...subject,
      assessments: this.data.getAssessmentsBySubject(subject.id)
    }));
}

  toggleEnroll(course: Course) {
    this.data.toggleEnroll(course.id, !course.enrolled);
    this.refreshDashboard();
  }

  getAttemptCount(asmtId: string): number {
    return this.data.getAttemptCount(asmtId);
  }
}
