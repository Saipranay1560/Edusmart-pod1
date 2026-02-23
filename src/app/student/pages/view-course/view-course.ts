import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-course.html',
  styleUrl: './view-course.css',
})
export class ViewCourse implements OnInit {
  courseId: string | null = null;
  activeTab: string = 'content';

  // Core Data
  course: any = {};
  contentVideos: any[] = [];
  assignments: any[] = [];
  quizzes: any[] = [];

  // Feedback Messages (REQUIRED to fix your TS2339 errors)
  assignmentSuccessMessage: string | null = null;
  contentSuccessMessage: string | null = null;
  contentErrorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
      if (this.courseId) {
        this.loadAllCourseData(this.courseId);
      }
    });
  }

  loadAllCourseData(id: string) {
    const courseUrl = `http://localhost:1930/api/courses/course/${id}`;
    const quizUrl = `http://localhost:1930/api/quizzes/course/${id}`;
    const assignUrl = `http://localhost:1930/api/assignments/course/${id}`;

    // forkJoin fetches all 3 APIs at once
    forkJoin({
      course: this.http.get<any>(courseUrl),
      quizzes: this.http.get<any[]>(quizUrl),
      assignments: this.http.get<any[]>(assignUrl)
    }).subscribe({
      next: (res) => {
        this.course = res.course;
        this.contentVideos = res.course.contentVideos || [];
        console.log("Course Data:", res.quizzes);
        console.log("Course Data:", res.assignments);
        console.log("Course Data:", res.course.contentVideos);
        this.quizzes = res.quizzes || [];
        this.assignments = res.assignments || [];
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.contentErrorMessage = 'Failed to load course details.';
      }
    });
  }

  goBack() {
    window.history.back();
  }

  // Template Helper Methods
  hasQuizzes(): boolean {
    return this.quizzes.length > 0;
  }

  quizzesList(): any[] {
    return this.quizzes;
  }

  takeAssignment(assignmentId: string | number) {
    if (assignmentId) {
      // Navigate to take-assignment route with assignmentId
      window.location.href = `/student/take-assignment/${assignmentId}`;
      // If you want to use Angular Router, inject Router and use:
      // this.router.navigate([`/student/take-assignment`, assignmentId]);
    }
  }

  takeQuiz(quiz: any) {
    if(quiz) {
      this.router.navigate([`/student/take-quiz`], {state: { quiz }});
    }
  }
}