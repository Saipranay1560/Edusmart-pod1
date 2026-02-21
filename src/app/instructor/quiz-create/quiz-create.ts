import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseDetailsService } from '../../services/course-details';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public courseDetailsService: CourseDetailsService
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
    if (this.quizQuestions.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    const quizData: QuizData = {
      questionTitle: this.quizTitle.trim() || 'Untitled Quiz',
      description: this.quizDescription.trim() || '',
      questions: this.quizQuestions
    };

    console.log('Quiz Data:', JSON.stringify(quizData, null, 2));
    alert(`Quiz saved successfully!\n\n${JSON.stringify(quizData, null, 2)}`);

    // Navigate back to course details
    this.goBack();
  }

  goBack() {
    if (this.courseId) {
      this.router.navigate(['/instructor/course-details', this.courseId]);
    } else {
      this.router.navigate(['/instructor/courses']);
    }
  }
}
