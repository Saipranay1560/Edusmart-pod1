import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../../services/quiz-service'; // Corrected path

@Component({
  selector: 'app-take-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.css',
})
export class TakeQuiz {
  quiz: any = null;
  userAnswers: { [questionId: string]: string } = {};
  score: number | null = null;
  resultJson: any = null;

  constructor(
    private router: Router,
    private quizService: QuizService,
  ) {
    const nav = this.router.getCurrentNavigation();
    this.quiz = nav?.extras.state?.['quiz'] || null;
  }

  submitQuiz() {
    if (!this.quiz) return;

    let correct = 0;
    const questions = this.quiz.questions.map((q: any) => {
      const selectedAnswer = this.userAnswers[q.id];
      if (selectedAnswer === q.answer) correct++;
      return {
        title: q.title,
        options: q.options,
        answer: q.answer,
        selectedAnswer: selectedAnswer || null
      };
    });

    this.score = correct;


    const submissionData = {
      courseId: Number(this.quiz.courseId),
      quizId: Number(this.quiz.id),
      studentId: JSON.parse(localStorage.getItem('user') || '{}').id,
      questionTitle: this.quiz.questionTitle,
      description: this.quiz.description,
      answers: questions
    };


    this.quizService.submitQuiz(submissionData).subscribe({
      next: (response: any) => { // Added explicit 'any' type
        console.log('Quiz submitted successfully', response);
        this.resultJson = submissionData;
        alert(`Quiz submitted! Your score: ${this.score} / ${this.quiz.questions.length}`);
      },
      error: (err: any) => { // Added explicit 'any' type
        console.error('Error submitting quiz', err);
        alert('There was an error submitting your quiz. Please try again.');
      }
    });
  }
}
