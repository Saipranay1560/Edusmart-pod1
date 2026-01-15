
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data';
import { Assessment, Subject } from '../../shared';

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assessments.html',
  styleUrls: ['./assessments.css']
})
export class Assessments {
  subjects: Subject[] = [];
  assessmentsBySubject: Record<string, Assessment[]> = {};

  constructor(public data: DataService) {
    this.subjects = data.getSubjects();
    for (const s of this.subjects) {
      this.assessmentsBySubject[s.id] = data.getAssessmentsBySubject(s.id);
    }
  }
  canTakeAssessment(assessment: Assessment): boolean {
  const taken = this.data.getAttemptCount(assessment.id);
  return taken < assessment.attempts;
}
}
