
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../../services/data';
import { Course } from '../../shared';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.css']
})
export class CourseDetail {
unenroll(_t3: any) {
throw new Error('Method not implemented.');
}
  course?: Course;

  constructor(private route: ActivatedRoute, private data: DataService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.course = data.getCourse(id);
  }
}
