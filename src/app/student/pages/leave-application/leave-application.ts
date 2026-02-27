import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveRequestService } from '../../../services/leave-request';
import { LeaveRequest } from '../../../models/leave-request';

@Component({
  selector: 'app-leave-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-application.html',
  styleUrls: ['./leave-application.css']
})
export class LeaveApplication implements OnInit {
  leaveDate = signal<string>('');
  leaveType = signal<string>('');
  isSubmitted = signal<boolean>(false);
  isProcessing = signal<boolean>(false);
  today = signal<string>(new Date().toISOString().split('T')[0]);
  studentId = signal<number>(0);

  constructor(private leaveService: LeaveRequestService) {}

  ngOnInit() {
    // Retrieve student details from local storage set during login in AuthController
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData && userData.id) {
    this.studentId.set(userData.id);
    console.log('Logged in as:', userData.name); // This should be dynamic
  } else {
    console.error('No user data found in storage');
  }
  }

  onSubmit() {
    if (this.isProcessing()) return;
    if (this.leaveDate() && this.leaveType()) {
      this.isProcessing.set(true) ;
      const payload: LeaveRequest = {
        studentId: this.studentId(),
        leaveDate: this.leaveDate(),
        reason: this.leaveType() // Mapping frontend leaveType to backend reason
      };

      this.leaveService.applyLeave(payload).subscribe({
        next: (response) => {
          console.log('Leave applied successfully', response);
          this.isSubmitted.set(true)  ;
        },
        error: (err) => {
          console.error('Error applying leave', err);
          alert("Failed to submit leave application: " + err.error);
        }
      });
    } else {
      alert("Please fill in the date and leave type.");
    }
  }

  resetForm() {
    this.isSubmitted.set(false);
    this.isProcessing.set(false);
    this.leaveDate.set('');
    this.leaveType.set('');
  }
}
