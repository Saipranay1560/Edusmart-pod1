import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.html',
  styleUrls: ['./progress.css']
})
export class Progress {
 
  studentName = 'Rahul';
 
  courses = [
    {
      title: 'Angular Fundamentals',
      completion: 75,
      score: 82,
      status: 'In Progress'
    },
    {
      title: 'Java Basics',
      completion: 100,
      score: 88,
      status: 'Completed'
    },
    {
      title: 'Python for Beginners',
      completion: 40,
      score: 65,
      status: 'In Progress'
    }
  ];
 
}
