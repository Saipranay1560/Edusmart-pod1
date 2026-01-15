
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';
import { SubjectProgress, OverallProgress, Subject } from '../../shared';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.html',
  styleUrls: ['./progress.css']
})
export class Progress {
  subjects: Subject[] = [];
  subjectNameById: Record<string, string> = {};
  subjectProgress: SubjectProgress[] = [];
  overall?: OverallProgress;

  constructor(private data: DataService) {
    this.subjects = data.getSubjects();
    this.subjectNameById = this.subjects.reduce((acc, s) => {
      acc[s.id] = s.name;
      return acc;
    }, {} as Record<string, string>);
       this.refresh();
  }

  refresh() {
  this.subjectProgress = this.data.getSubjectProgress();
  this.overall = this.data.getOverallProgress();
}
}
