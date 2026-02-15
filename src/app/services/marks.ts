import { Injectable } from '@angular/core';
import { StudentMark } from '../models/marks';

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  students: StudentMark[] = [
    { name: 'Rahul', course: 'Angular Fundamantals', marks: 85 },
    { name: 'Sneha', course: 'java Basics', marks: 78 },
    { name: 'Amit', course: 'Angular Fundamentals', marks: 92 }
  ];

  /** When true, marks are published and read-only in UI */
  published = false;

  updateMarks(student: StudentMark, value: number) {
    student.marks = value;
  }

  replaceStudents(newStudents: StudentMark[]) {
    this.students = newStudents;
  }

  togglePublished() {
    this.published = !this.published;
  }
}
