import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
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
    this.resultJson = {
      quizTitle: this.quiz.questionTitle,
      description: this.quiz.description,
      questions,
      score: this.score,
    };
  }
}
