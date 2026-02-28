import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Define the interface directly if you don't want a separate model file
interface Quiz {
  id: number;
  questionTitle: string;
  description?: string;
  course: any;
  questions?: any[];
}

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assessments.html',
  styleUrls: ['./assessments.css']
})
export class AssessmentsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:1930/api/quizzes';

  // State Signals
  quizzes = signal<Quiz[]>([]);
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(true);

  // Filtered Logic
  // filteredQuizzes = computed(() => {
  //   const term = this.searchTerm().toLowerCase();
  //   return this.quizzes().filter(q => 
  //     q.questionTitle.toLowerCase().includes(term) ||
  //     q.course.name.toLowerCase().includes(term)
  //   );
  // });

  totalCount = computed(() => this.quizzes().length);

  ngOnInit(): void {
    this.fetchQuizzes();
  }

  fetchQuizzes(): void {
    this.isLoading.set(true);
    this.http.get<Quiz[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Fetched quizzes:', data);
        this.quizzes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching quizzes:', err);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  viewQuiz(id: number): void {
    this.router.navigate(['/admin/view-quiz', id]);
  }
}