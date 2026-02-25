import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-assign-view-submission',
  templateUrl: './assign-view-submission.html',
  styleUrls: ['./assign-view-submission.css'],
  imports: [NgIf,NgFor,CommonModule]
})
export class AssignViewSubmissionComponent implements OnInit {
  submissions: any[] = [];
  assignmentId!: number;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.assignmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSubmissions();
  }

  loadSubmissions() {
  this.assignmentService.getSubmissionsByAssignmentId(this.assignmentId).subscribe({
    next: (data) => {
      console.log('Submissions fetched successfully', data);
      this.submissions = data; // Already filtered by the backend
      this.loading = false;
    },
    error: (err) => {
      console.error('Error fetching submissions', err);
      this.loading = false;
    }
  });
}

  goBack() {
    this.router.navigate(['/instructor/course-details', this.submissions[0]?.courseId]); // Adjust based on your routing
  }
}
