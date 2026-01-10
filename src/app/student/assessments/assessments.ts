import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assessments.html',
  styleUrls: ['./assessments.css']
})
export class Assessments {
 
  assessments = [
    {
      id: 1,
      subject: 'Angular',
      title: 'Angular Basics Quiz',
      marks: 20,
      attempts: 2
    },
    {
      id: 2,
      subject: 'Angular',
      title: 'Components Test',
      marks: 30,
      attempts: 2
    },
    {
      id: 3,
      subject: 'Java',
      title: 'Java Fundamentals',
      marks: 25,
      attempts: 1
    }
  ];
}