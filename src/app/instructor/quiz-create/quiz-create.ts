import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../services/quiz-service';

interface QuizQuestion {
  title: string;
  options: string[];
  answer: string;
}

interface QuizData {
  questionTitle: string;
  description: string;
  questions: QuizQuestion[];
}

@Component({
  selector: 'app-quiz-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-create.html',
  styleUrls: ['./quiz-create.css']
})
export class QuizCreate implements OnInit {

  quizService = inject(QuizService);

  courseId: number | null = null;
  quizQuestions: QuizQuestion[] = [];

  newQuestion: string = '';
  option1: string = '';
  option2: string = '';
  option3: string = '';
  option4: string = '';
  correctOption: string = '';

  quizTitle: string = '';
  quizDescription: string = '';

  isSaving: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'] ? Number(params['courseId']) : null;
    });
  }

  addQuestion() {
    if (!this.newQuestion.trim()) {
      alert('Please enter a question.');
      return;
    }
    if (!this.option1.trim() || !this.option2.trim() || !this.option3.trim() || !this.option4.trim()) {
      alert('Please enter all 4 options.');
      return;
    }
    if (!this.correctOption.trim()) {
      alert('Please select a correct answer.');
      return;
    }

    const question: QuizQuestion = {
      title: this.newQuestion.trim(),
      options: [
        this.option1.trim(),
        this.option2.trim(),
        this.option3.trim(),
        this.option4.trim()
      ],
      answer: this.correctOption.trim()
    };

    this.quizQuestions.push(question);

    // Clear form
    this.newQuestion = '';
    this.option1 = '';
    this.option2 = '';
    this.option3 = '';
    this.option4 = '';
    this.correctOption = '';
  }

  deleteQuestion(index: number) {
    this.quizQuestions.splice(index, 1);
  }

  saveQuiz() {
    // Clear previous messages
    this.successMessage = null;
    this.errorMessage = null;

    // Validate quiz title
    if (!this.quizTitle.trim()) {
      this.errorMessage = 'Please enter a quiz title.';
      setTimeout(() => { this.errorMessage = null; }, 4000);
      return;
    }

    // Validate questions
    if (this.quizQuestions.length === 0) {
      this.errorMessage = 'Please add at least one question.';
      setTimeout(() => { this.errorMessage = null; }, 4000);
      return;
    }

    // Validate each question has a valid answer
    for (let i = 0; i < this.quizQuestions.length; i++) {
      const q = this.quizQuestions[i];
      if (!q.answer || !q.options.includes(q.answer)) {
        this.errorMessage = `Question ${i + 1}: Answer must be one of the options.`;
        setTimeout(() => { this.errorMessage = null; }, 4000);
        return;
      }
    }

    // Build payload matching API format
    const quizData: QuizData = {
      questionTitle: this.quizTitle.trim(),
      description: this.quizDescription.trim() || '',
      questions: this.quizQuestions
    };

    if (!this.courseId) {
      this.errorMessage = 'Course ID not found. Quiz cannot be saved without a valid course.';
      setTimeout(() => { this.errorMessage = null; }, 4000);
      return;
    }

    this.isSaving = true;
    console.log('Saving quiz for course ID:', this.courseId);
    console.log('Quiz Data:', JSON.stringify(quizData, null, 2));

    this.quizService.saveQuiz(quizData, this.courseId).subscribe({
      next: (response: any) => {
        this.isSaving = false;
        this.successMessage = 'Quiz saved successfully!';
        console.log('Quiz saved:', response);

        // Navigate back after brief delay to ensure backend processes the save
        setTimeout(() => {
          this.goBack();
        }, 1500);
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error('Error saving quiz:', err);

        // Extract error message from various possible response formats
        let errorMsg = 'Failed to save quiz';
        if (err.error?.message) {
          errorMsg += ': ' + err.error.message;
        } else if (err.error?.error) {
          errorMsg += ': ' + err.error.error;
        } else if (err.message) {
          errorMsg += ': ' + err.message;
        } else if (typeof err.error === 'string') {
          errorMsg += ': ' + err.error;
        }

        this.errorMessage = errorMsg;
        setTimeout(() => { this.errorMessage = null; }, 4000);
      }
    });
  }


  goBack() {
    if (this.courseId) {
      this.router.navigate(['/instructor/course-details', this.courseId]);
    } else {
      this.router.navigate(['/instructor/courses']);
    }
  }
}
