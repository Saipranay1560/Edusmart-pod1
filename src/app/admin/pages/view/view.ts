import { CommonModule, NgIf } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { SafePipe } from '../../../pipes/safe-pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { StudentProgress } from '../../../models/progress.model';
import { ContentService } from '../../../services/content-service';
import { ProgressService } from '../../../services/progress';

@Component({
  selector: 'app-view',
  imports: [CommonModule, NgIf, SafePipe],
  templateUrl: './view.html',
  styleUrl: './view.css',
})
export class View implements OnInit {
  courseId = signal<string | null>(null);
  activeTab =  signal<string>("content");
  progress? = signal<StudentProgress | undefined>(undefined); 

  course = signal<any>({});
  contentVideos = signal<any[]>([]);
  assignments = signal<any[]>([]);
  quizzes = signal<any[]>([]);

  assignmentSuccessMessage = signal<string | null>(null);
  contentSuccessMessage =signal<string | null>(null);
  contentErrorMessage=signal<string | null>(null);

  hasQuizzes = computed(() => this.quizzes().length > 0);
  quizzesList = computed(() => this.quizzes());

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private contentService: ContentService,
    private progressService: ProgressService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId.set(params['id']);
      if (this.courseId()) {
        this.loadAllCourseData(this.courseId()!);

      }
    });
  }



  loadAllCourseData(id: string) {
    const courseUrl = `http://localhost:1930/api/courses/course/${id}`;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const quizUrl = `http://localhost:1930/api/quizzes/course/${id}/unsolved?studentId=${user.id}`;
    const assignUrl = `http://localhost:1930/api/assignments/unsolved?courseId=${id}&studentId=${user.id}`;

    forkJoin({
      course: this.http.get<any>(courseUrl),
      quizzes: this.http.get<any[]>(quizUrl),
      assignments: this.http.get<any[]>(assignUrl),
      videos: this.contentService.getContentByCourseId(+id)
    }).subscribe({
      next: (res) => {
        this.course.set(res.course);
        this.quizzes.set(res.quizzes || []);
        this.assignments.set(res.assignments || []);
        this.contentVideos.set(res.videos || []);
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.contentErrorMessage.set('Failed to load course details.');
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }




  goBack() {
    window.history.back();
  }
}
