import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-view-submission',
  standalone: true,
  templateUrl: './assign-view-submission.html',
  styleUrls: ['./assign-view-submission.css'],
  imports: [NgIf, NgFor, CommonModule, FormsModule]
})
export class AssignViewSubmissionComponent implements OnInit {
  submissions = signal<any[]>([]);
  assignmentId = signal<number>(0);
  loading = signal<boolean>(true);

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.assignmentId.set(id);
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.loading.set(true);
    this.assignmentService.getSubmissionsByAssignmentId(this.assignmentId()).subscribe({
      next: (data) => {
        console.log('Submissions fetched successfully', data);
        const prepared = (data || []).map((s: any) => ({
          ...s,
          editing: false,
          draftScore: s.score != null ? s.score : null
        }));
        this.submissions.set(prepared);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching submissions', err);
        this.submissions.set([]);
        this.loading.set(false);
      }
    });
  }

  goBack() {
    const courseId = this.submissions()[0]?.courseId;
    if (courseId) {
      this.router.navigate(['/instructor/course-details', courseId]);
    } else {
      this.router.navigate(['/instructor/courses']);
    }
  }

  editScore(sub: any) {
    this.submissions.update(arr => arr.map(s => s.id === sub.id ? { ...s, editing: true, draftScore: s.score != null ? s.score : null } : s));
  }

  cancelEdit(sub: any) {
    this.submissions.update(arr => arr.map(s => s.id === sub.id ? { ...s, editing: false, draftScore: s.score != null ? s.score : null } : s));
  }

  saveScore(sub: any) {
    const parsed = sub.draftScore == null ? null : Number(sub.draftScore);
    if (parsed == null || isNaN(parsed) || parsed < 0 || parsed > 50) {
      alert('Please enter a valid integer score between 0 and 50');
      return;
    }
    console.log(`Saving score ${parsed} for submission ${sub.id}`);
    this.assignmentService.addScoretoSubmission(sub.id, parsed).subscribe({
      next: () => {
        this.submissions.update(arr => arr.map(s => s.id === sub.id ? { ...s, score: parsed, editing: false, draftScore: parsed } : s));
      },
      error: (err) => {
        console.error('Failed to save score', err);
        alert('Failed to save score');
      }
    });
  }
}
