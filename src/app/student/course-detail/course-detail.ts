import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.css']
})
export class CourseDetail {
 
  course: any;
 
  // 👇 static data (same as courses page)
  courses = [
    {
      id: 1,
      title: 'Angular Fundamentals',
      mode: 'Instructor-led',
      credits: 4,
      description: 'Learn Angular from basics to advanced concepts.',
      schedule: [
        { day: 'Monday', time: '10:00 AM' },
        { day: 'Wednesday', time: '12:00 PM' }
      ]
    },
    {
      id: 2,
      title: 'Java Basics',
      mode: 'Self-paced',
      credits: 3,
      description: 'Understand Java programming fundamentals.',
      schedule: [
        { day: 'Tuesday', time: '6:00 PM' }
      ]
    },
    {
      id: 3,
      title: 'Python for Beginners',
      mode: 'Self-paced',
      credits: 5,
      description: 'Start your Python journey from scratch.',
      schedule: [
        { day: 'Friday', time: '4:00 PM' }
      ]
    }
  ];
 
  constructor(private route: ActivatedRoute) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.course = this.courses.find(c => c.id === id);
  }
}