import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignments.html',
  styleUrls: ['./assignments.css']
})
export class Assignments {
 
  courses = ['Angular Fundamentals', 'Java Basics'];
 
  assignment = {
    title: '',
    course: '',
    dueDate: '',
    questions: ''
  };
 
  assignmentsList: any[] = [];
 
  publishAssignment() {
    if (
      !this.assignment.title ||
      !this.assignment.course ||
      !this.assignment.dueDate ||
      !this.assignment.questions
    ) {
      alert('Please fill all fields');
      return;
    }
 
    this.assignmentsList.push({
      ...this.assignment,
      status: 'Published'
    });
 
    // Reset form
    this.assignment = {
      title: '',
      course: '',
      dueDate: '',
      questions: ''
    };
  }
}