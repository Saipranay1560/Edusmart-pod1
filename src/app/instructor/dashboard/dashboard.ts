import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './dashboard.html',
  imports:[CommonModule,FormsModule,RouterModule],
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
 
  constructor(private router: Router) {}
 
  stats = {
    students: 3,
    pendingApprovals: 1,
    assignments: 5
  };
 
  attendancePercent = 82;
 
  activities = [
    'Sneha submitted assignment',
    'Rahul requested leave',
    'Attendance marked for Course 2',
    'New assignment published'
  ];
 
  goTo(path: string) {
    this.router.navigate(['/instructor', path]);
  }
}
