import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-assignment.html',
  styleUrl: './take-assignment.css',
})
export class TakeAssignment {
  assignment: any = null;
  loading: boolean = false;
  error: string | null = null;

  // Object to store answers where key is index or question string
  userAnswers: { [key: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    this.assignment = nav?.extras.state?.['assignment'] || null;
    console.log('Received assignment:', this.assignment);
  }

  submitAssignment() {
    if (!this.assignment) return;

    // Fetch student_id from localStorage user json
    const userJson = localStorage.getItem('user');
    const studentId = userJson ? JSON.parse(userJson).id : null;

    // Create questions_answer_pair
    const questionsAnswerPair = this.assignment.questions.map((q: string, index: number) => {
      return {
        question: q,
        answer: this.userAnswers[index] || ''
      };
    });

    // Construct Result JSON
    const resultJson = {
      assignment_id: this.assignment.id,
      assignment_title: this.assignment.title,
      enddate: this.assignment.endDate,
      submitteddate: new Date().toISOString().split('T')[0], // Current date (YYYY-MM-DD)
      questions_answer_pair: questionsAnswerPair,
      course_id: this.assignment.course.id,
      student_id: studentId
    };

    console.log('Submission Result JSON:', resultJson);

    // Alerting the JSON for verification
    alert('Assignment Submitted! Check console for Result JSON.');

    // Optional: Call your API here
    // this.http.post('YOUR_API_ENDPOINT', resultJson).subscribe(...)
  }
}
