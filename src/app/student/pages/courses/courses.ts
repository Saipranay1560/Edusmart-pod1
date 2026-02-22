import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data';
import { Course, Subject, OverallProgress } from '../../shared';
import { CourseService } from '../../../services/course-service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class Courses implements OnInit {
  availableCourses = signal<Course[]>([]);
  enrolledCourses = signal<Course[]>([]);
  enrolledSubjects: any[] = [];
  overall?: OverallProgress;
  isLoading= signal<boolean>(false);

  constructor(
    private data: DataService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshDashboard();
  }

  // Inside Courses Component
  refreshDashboard() {
    this.isLoading.set(true);
    this.overall = this.data.getOverallProgress();
    // Load approved courses from backend via CourseService

    const userId = this.authService.getUser();
    const studentId = userId?.id || 0;

    if (studentId) {
      this.courseService.getEnrolledCourseById(studentId).subscribe({
        next: (course: any) => {
          const courseArray = Array.isArray(course) ? course : [course];

          const mappedCourses = (courseArray || []).map((item: any) => {
            const status : 'available' | 'pending' | 'enrolled' = 'enrolled';
            return {
              id: item.id,
              title: item.title || item.name || '',
              description: item.description || '',
              credits: item.credits || 0,
              enrolled: true,
              status: status,
              schedule: item.schedule || []
            };
          });

          this.enrolledCourses.set(mappedCourses);
          console.log('Enrolled courses loaded for student:', mappedCourses);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load enrolled courses:', err);
          this.enrolledCourses.set([]);
          this.isLoading.set(false);
        }
      });
            }else{
              console.warn('No student ID found. Skipping enrolled courses load.');
              this.isLoading.set(false);
            }
    this.courseService.getByStatusAndEnrollment(this.authService.getUser()?.id || 0).subscribe({
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

  enrollInCourse(course: Course) {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      alert('User not found. Please log in again.');
      return;
    }
    this.enrollmentService.requestEnrollment(user.id, course.id).subscribe({
      next: (res) => {
        alert('Enrollment request sent!');
        this.refreshDashboard();
      },
      error: (err) => {
        alert('Failed to enroll: ' + (err.error?.message || err.message));
      }
    });
  }

  getAttemptCount(asmtId: string): number {
    return this.data.getAttemptCount(asmtId);
  }

  viewEnrolledCourse(courseId: number) {
    // navigate to course details page for enrolled course
    this.router.navigate(['/student/course-details', courseId]);
    console.log('Navigating to course details for course ID:', courseId);
  }
}
