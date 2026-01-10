import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subjects.html',
  styleUrls: ['./subjects.css']
})
export class Subjects {
 
  subjects = [
    {
      name: 'Angular',
      description: 'Frontend framework for building single-page applications',
      courses: 2
    },
    {
      name: 'Java',
      description: 'Object-oriented programming language for backend development',
      courses: 1
    },
    {
      name: 'Python',
      description: 'Beginner-friendly language for scripting and data analysis',
      courses: 1
    }
  ];
 
}
