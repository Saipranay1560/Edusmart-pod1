
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data';
import { GradingService } from '../../services/grading';
import { Assessment } from '../../shared';
import { ExamService } from '../../services/exam';

@Component({
  selector: 'app-assessment-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assessment-quiz.html',
  styleUrls: ['./assessment-quiz.css']
})
export class AssessmentQuiz {
  assessment?: Assessment;
  selected: Record<string, number | null> = {};
  resultMsg = '';
  inSecureMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private grading: GradingService,
    private exam: ExamService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.assessment = data.getAssessment(id);
    if (this.assessment) {
      for (const q of this.assessment.questions) this.selected[q.id] = null;
    }
  }

  startSecure() {
    this.exam.startSecureExam(10);
    this.inSecureMode = true;
  }

  endSecure() {
    this.exam.endSecureExam();
    this.inSecureMode = false;
  }

  submit() {
    if (!this.assessment) return;
    const res = this.grading.grade(this.assessment, this.selected);
    this.data.recordResult(res);
    this.resultMsg = `Score: ${res.score}/${res.maxMarks} (${res.percentage}%). ${res.passed ? 'Passed ✅' : 'Try again ❌'}`;
    if (this.inSecureMode) this.endSecure();
    setTimeout(() => this.router.navigate(['/portal/progress']), 1200);
  }
}
