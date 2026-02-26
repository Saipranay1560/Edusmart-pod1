import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuizService } from '../../services/quiz-service';

@Component({
  selector: 'app-view-quiz-instructor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-quiz-instructor.html',
  styleUrl: './view-quiz-instructor.css'
})
export class ViewQuizInstructor implements OnInit {
  // Define signals for state management
  quizId = signal<number | null>(null);
  submissions = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quizId.set(id);
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    const currentId = this.quizId();
    if (currentId) {
      this.isLoading.set(true);
      this.quizService.getQuizSubmissions(currentId).subscribe({
        next: (data) => {
          this.submissions.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error("Error fetching submissions:", err);
          this.errorMessage.set("Failed to load student submissions.");
          this.isLoading.set(false);
        }
      });
    }
  }
}