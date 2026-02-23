import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../../services/quiz-service';

@Component({
  selector: 'app-take-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-assignment.html',
  styleUrl: './take-assignment.css',
})
export class TakeAssignment implements OnInit {
  courseId!: number;
  quizzes: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  
  // Stores answers as { questionId: "Selected Option Text" }
  userAnswers: { [key: number]: string } = {}; 

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // 1. Get Course ID from the URL (e.g., /take-assignment/1)
    const idParam = this.route.snapshot.paramMap.get('courseId');
    if (idParam) {
      this.courseId = +idParam;
      this.fetchQuizData();
    } else {
      this.error = "Invalid Course ID.";
    }
  }

  fetchQuizData() {
    this.loading = true;
    this.quizService.getQuizzes(this.courseId).subscribe({
      next: (data: any) => {
        // Backend returns a List, ensure we handle it as an array
        this.quizzes = Array.isArray(data) ? data : [data];
        this.loading = false;
      },
      error: (err) => {
        console.error("Fetch error:", err);
        this.error = "Failed to load quiz. Verify your login session.";
        this.loading = false;
      }
    });
  }

  submitQuiz(quiz: any) {
    const studentId = localStorage.getItem('userId');
    
    if (!studentId) {
      alert("Session expired. Please log in again.");
      return;
    }

    // 2. Build the payload to match your Java QuizSubmissionDTO
    const submissionPayload = {
      courseId: this.courseId,
      quizId: quiz.id,
      studentId: +studentId,
      questionTitle: quiz.questionTitle,
      description: quiz.description,
      // Map dictionary to List<AnswerDTO>
      answers: Object.keys(this.userAnswers).map(qId => ({
        questionId: +qId,
        selectedOption: this.userAnswers[+qId]
      }))
    };

    if (submissionPayload.answers.length === 0) {
      alert("Please answer at least one question.");
      return;
    }

    // 3. POST to your QuizSubmissionController
    this.http.post('http://localhost:1930/api/quizzes/submit', submissionPayload).subscribe({
      next: (res: any) => {
        alert(`Quiz submitted! Your Score: ${res.score}`);
        this.router.navigate(['/student-dashboard']);
      },
      error: (err) => {
        console.error("Submission error:", err);
        alert("Submission failed. Check backend logs for DTO mismatch.");
      }
    });
  }

  goBack() {
    history.back();
  }
}