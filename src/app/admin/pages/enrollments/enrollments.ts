import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Enrollment {
 studentName: string;
 courseName: string;
 enrollmentDate: Date;
 status: 'Active' | 'Completed';
}
@Component({
 selector: 'app-enrollments',
 standalone: true,
 imports: [CommonModule,FormsModule, DatePipe],
 templateUrl: './enrollments.html',
 styleUrls: ['./enrollments.css']
})
export class EnrollmentsComponent implements OnInit {
 /* ==========================
    Enrollment Data
    ========================== */
 enrollments: Enrollment[] = [
   {
     studentName: 'John Doe',
     courseName: 'Angular Fundamentals',
     enrollmentDate: new Date('2026-01-12'),
     status: 'Active'
   },
   {
     studentName: 'Jane Smith',
     courseName: 'Data Science Basics',
     enrollmentDate: new Date('2026-01-10'),
     status: 'Completed'
   },
   {
     studentName: 'Rahul Kumar',
     courseName: 'AI & ML',
     enrollmentDate: new Date('2026-01-05'),
     status: 'Active'
   }
 ];
 /* ==========================
    Filters
    ========================== */
 searchText: string = '';
 selectedCourse: string = '';
 selectedStatus: string = '';
 /* ==========================
    Derived Data
    ========================== */
 courses: string[] = [];
 totalEnrollments: number = 0;
 activeEnrollments: number = 0;
 completedEnrollments: number = 0;
 constructor() {}
 ngOnInit(): void {
   this.loadCourses();
   this.updateStats();
 }
 /* ==========================
    Load Unique Courses
    ========================== */
 loadCourses(): void {
   this.courses = Array.from(
     new Set(this.enrollments.map(e => e.courseName))
   );
 }
 /* ==========================
    Filter Logic
    ========================== */
 filteredEnrollments(): Enrollment[] {
   return this.enrollments.filter(e => {
     const matchesSearch =
       e.studentName.toLowerCase().includes(this.searchText.toLowerCase());
     const matchesCourse =
       !this.selectedCourse || e.courseName === this.selectedCourse;
     const matchesStatus =
       !this.selectedStatus || e.status === this.selectedStatus;
     return matchesSearch && matchesCourse && matchesStatus;
   });
 }
 /* ==========================
    Statistics
    ========================== */
 updateStats(): void {
   this.totalEnrollments = this.enrollments.length;
   this.activeEnrollments = this.enrollments.filter(
     e => e.status === 'Active'
   ).length;
   this.completedEnrollments = this.enrollments.filter(
     e => e.status === 'Completed'
   ).length;
 }
 /* ==========================
    Actions
    ========================== */
 
}