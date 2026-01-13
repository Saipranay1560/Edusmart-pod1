
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../student/services/data';
import { Course } from '../../student/shared';

@Component({
  selector: 'app-virtual-classroom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './virtual-classroom.html',
  styleUrls: ['./virtual-classroom.css']
})
export class VirtualClassroom {
  course?: Course;

  constructor(private route: ActivatedRoute, private data: DataService) {
    const id = this.route.snapshot.paramMap.get('courseId')!;
    this.course = data.getCourse(id);
  }
}
