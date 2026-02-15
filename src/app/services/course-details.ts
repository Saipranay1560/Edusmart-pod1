import { Injectable } from '@angular/core';
import { CourseDetailsModel, Module, Assignment, Resource, Quiz } from '../models/course-details';
 
@Injectable({
  providedIn: 'root'
})
export class CourseDetailsService {
 
  activeTab: 'content' | 'assignments' | 'resources' | 'progress' | 'quiz' = 'content';
 
  // Store courses with details mapped by ID
  private courseDetails: { [key: number]: CourseDetailsModel } = {
    1: {
      id: 1,
      title: 'Angular Fundamentals',
      description: 'Learn Angular from basics to advanced concepts.',
      published: false,
      modules: [
        { name: 'Introduction', lessons: ['What is Angular?', 'Angular Architecture'] },
        { name: 'Components', lessons: ['Component Basics', 'Lifecycle Hooks'] },
        { name: 'Routing', lessons: ['Router Module', 'Route Guards'] }
      ]
    },
    2: {
      id: 2,
      title: 'Java Basics',
      description: 'Learn Core Java concepts from fundamentals.',
      published: false,
      modules: [
        { name: 'Syntax', lessons: ['Variables', 'Data Types', 'Operators'] },
        { name: 'OOP Concepts', lessons: ['Classes', 'Objects', 'Inheritance', 'Polymorphism'] },
        { name: 'Collections', lessons: ['Arrays', 'Lists', 'Maps'] }
      ]
    }
  };

  course: CourseDetailsModel = this.courseDetails[1];
 
  assignments: Assignment[] = [];
  addAssignment(assignment: Assignment) {
    this.assignments.push(assignment);
  }
 
  resources: Resource[] = [];
 
  progress = 45;
 
  quiz: Quiz = {
    title: 'Quiz',
    questions: []
  };

  loadCourseById(id: number): void {
    if (this.courseDetails[id]) {
      this.course = this.courseDetails[id];
      this.assignments = [];
      this.resources = [];
      this.quiz = { title: `${this.course.title} Quiz`, questions: [] };
    }
  }
 
  addPdf(file: File) {
    if (file && file.type === 'application/pdf') {
      this.resources.push({
        name: file.name,
        type: 'PDF',
        file
      });
    }
  }
 
  addVideo(file: File) {
    if (file && file.type.startsWith('video/')) {
      this.resources.push({
        name: file.name,
        type: 'Video',
        file
      });
    }
  }
 
  togglePublish() {
    this.course.published = !this.course.published;
  }
}
