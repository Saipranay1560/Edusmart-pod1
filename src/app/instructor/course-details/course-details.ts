import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css']
})
export class CourseDetails {
 
  constructor(private router: Router) {}
 
  activeTab: 'content' | 'assignments' | 'resources' | 'progress' | 'quiz' = 'content';
 
  course = {
    title: 'Angular Fundamentals',
    description: 'Learn Angular from basics to advanced concepts.',
    published: false,
    modules: [
      {
        name: 'Introduction',
        lessons: ['What is Angular?', 'Angular Architecture']
      },
      {
        name: 'Components',
        lessons: ['Component Basics', 'Lifecycle Hooks']
      },
      {
        name: 'Routing',
        lessons: ['Router Module', 'Route Guards']
      }
    ]
  };
 
  assignments = [
    { title: 'Angular Basics Assignment', dueDate: '2026-01-10', status: 'Pending' }
  ];
 
  resources: {
    name: string;
    type: 'PDF' | 'Video';
    file: File;
  }[] = [];
 
  progress = 45;
 
  quiz = {
    title: 'Angular Quiz',
    questions: [
      'What is Angular?',
      'What is a Component?'
    ]
  };
 
  openModuleIndex: number | null = null;
 
  toggleModule(index: number) {
    this.openModuleIndex = this.openModuleIndex === index ? null : index;
  }
 
  addAssignment() {
    this.assignments.push({
      title: 'New Assignment',
      dueDate: '2026-01-20',
      status: 'Pending'
    });
  }
 
  // 🔥 REAL FILE UPLOAD HANDLERS
  onPdfSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.resources.push({
        name: file.name,
        type: 'PDF',
        file
      });
    }
    event.target.value = '';
  }
 
  onVideoSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.resources.push({
        name: file.name,
        type: 'Video',
        file
      });
    }
    event.target.value = '';
  }
 
  togglePublish() {
    this.course.published = !this.course.published;
  }
 
  goBack() {
    this.router.navigate(['/instructor/courses']);
  }
}