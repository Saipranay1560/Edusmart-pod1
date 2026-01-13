
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../student/services/data';
import { Subject, Course } from '../../student/shared';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subjects.html',
  styleUrls: ['./subjects.css']
})
export class Subjects {
  subjects: Subject[] = [];
  coursesMap: Record<string, Course[]> = {};

  constructor(private data: DataService) {
    this.subjects = data.getSubjects();
    for (const s of this.subjects) {
      this.coursesMap[s.id] = data.getCoursesBySubject(s.id);
    }
  }
}
