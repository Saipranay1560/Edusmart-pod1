import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data';
import { Course, Subject, OverallProgress } from '../../shared';
import { CourseService } from '../../../services/course-service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class Courses implements OnInit {
  availableCourses = signal<Course[]>([]);
  enrolledSubjects: any[] = [];
  overall?: OverallProgress;

  constructor(private data: DataService, private courseService: CourseService) {}

  ngOnInit() {
    this.refreshDashboard();
  }

  // Inside Courses Component
refreshDashboard() {
  this.overall = this.data.getOverallProgress();

    // Load approved courses from backend via CourseService

    this.courseService.getByStatus('APPROVED').subscribe({
      next: (list: any[]) => {
        // Map backend course shape to student Course interface
        const mappedCourses = (list || []).map(item => ({
          id: item.id,
          title: item.title || item.name || '',
          description: item.description || '',
          credits: item.credits || 0,
          enrolled: !!item.enrolled,
          status: (item.status || 'available') as any,
          schedule: item.schedule || []
        }));

        this.availableCourses.set(mappedCourses);
        console.log('Approved courses loaded for student:', mappedCourses);
      },
      error: () => {
        // fallback: show all not-enrolled courses from local DataService
        this.availableCourses.set([]);
      }
    });

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
