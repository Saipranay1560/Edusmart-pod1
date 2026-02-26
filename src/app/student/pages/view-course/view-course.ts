import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ContentService } from '../../../services/content-service';
import { SafePipe } from '../../../pipes/safe-pipe';
import { ProgressService } from '../../../services/progress';
import { StudentProgress } from '../../../models/progress.model';

@Component({
  selector: 'app-view-course',
  standalone: true,
  imports: [CommonModule, SafePipe,NgIf],
  templateUrl: './view-course.html',
  styleUrl: './view-course.css',
})
export class ViewCourse implements OnInit {
  courseId: string | null = null;
  activeTab: string = 'content';

  progress?: StudentProgress;

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
    private contentService: ContentService,
    private progressService: ProgressService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
      if (this.courseId) {
        this.loadAllCourseData(this.courseId);
        this.loadProgress(); // Call progress loading on init
      }
    });
  }

  loadProgress() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = user.id; // Corrected to use user object ID consistent with your app
    const courseId = Number(this.courseId);

    if (studentId && courseId) {
      this.progressService.getCourseProgress(studentId, courseId).subscribe({
        next: (data) => this.progress = data,
        error: (err) => console.error('Error fetching progress', err)
      });
    }
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
