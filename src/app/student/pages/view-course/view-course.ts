import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ContentService } from '../../../services/content-service';
import { SafePipe } from '../../../pipes/safe-pipe';

@Component({
  selector: 'app-view-course',
  standalone: true,
  imports: [CommonModule, SafePipe], // Add SafePipe here to fix NG8004
  templateUrl: './view-course.html',
  styleUrl: './view-course.css',
})
export class ViewCourse implements OnInit {
  courseId: string | null = null;
  activeTab: string = 'content';

  course: any = {};
  contentVideos: any[] = [];
  assignments: any[] = [];
  quizzes: any[] = [];

  assignmentSuccessMessage: string | null = null;
  contentSuccessMessage: string | null = null;
  contentErrorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private contentService: ContentService
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const quizUrl = `http://localhost:1930/api/quizzes/course/${id}/unsolved?studentId=${user.id}`;
    const assignUrl = `http://localhost:1930/api/assignments/course/${id}`;

    forkJoin({
      course: this.http.get<any>(courseUrl),
      quizzes: this.http.get<any[]>(quizUrl),
      assignments: this.http.get<any[]>(assignUrl),
      videos: this.contentService.getContentByCourseId(+id)
    }).subscribe({
      next: (res) => {
        this.course = res.course;
        this.quizzes = res.quizzes || [];
        this.assignments = res.assignments || [];
        this.contentVideos = res.videos || [];
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.contentErrorMessage = 'Failed to load course details.';
      }
    });
  }

  // FIXED: Added missing methods to solve TS2551 and TS2339
  hasQuizzes(): boolean {
    return this.quizzes && this.quizzes.length > 0;
  }

  quizzesList(): any[] {
    return this.quizzes;
  }

  goBack() {
    window.history.back();
  }

  takeAssignment(assignment: any) {
    if(assignment){
      this.router.navigate([`/student/take-assignment`], {state: { assignment }});
    }
  }

  takeQuiz(quiz: any) {
    if(quiz) {
      this.router.navigate([`/student/take-quiz`], {state: { quiz }});
    }
  }
}