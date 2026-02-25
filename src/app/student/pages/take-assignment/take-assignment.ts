import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../services/assignment.service';

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

  // Object to store answers where key is the index of the question
  userAnswers: { [key: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private assignmentService: AssignmentService
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

    if (!studentId) {
      alert('Student ID not found. Please log in again.');
      return;
    }

    // Create questions_answer_pair matching the backend DTO structure
    const questionsAnswerPair = this.assignment.questions.map((q: string, index: number) => {
      return {
        question: q,
        answer: this.userAnswers[index] || ''
      };
    });

    // Construct Result JSON matching SubmissionDTO
    const resultJson = {
      assignment_id: this.assignment.id,
      assignment_title: this.assignment.title,
      course_id: this.assignment.course?.id || this.assignment.course_id,
      enddate: this.assignment.endDate,
      submitteddate: new Date().toISOString().split('T')[0], // Current date (YYYY-MM-DD)
      questions_answer_pair: questionsAnswerPair,
      student_id: studentId
    };

    console.log('Submitting Result JSON:', resultJson);

    // Call the backend API via AssignmentService
    this.assignmentService.submitAssignment(resultJson).subscribe({
      next: (response: any) => {
        console.log('Assignment submitted successfully:', response);
        alert('Assignment Submitted Successfully!');
        // Navigate back to courses or assignments list
        this.router.navigate(['/student/courses']);
      },
      error: (err: any) => {
        console.error('Error submitting assignment:', err);
        alert('There was an error submitting your assignment. Please try again.');
      }
    });
  }
}
