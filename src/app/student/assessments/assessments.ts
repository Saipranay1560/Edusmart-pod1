
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../student/services/data';
import { Assessment, Subject } from '../../student/shared';

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

  constructor(private data: DataService) {
    this.subjects = data.getSubjects();
    for (const s of this.subjects) {
      this.assessmentsBySubject[s.id] = data.getAssessmentsBySubject(s.id);
    }
  }
}
