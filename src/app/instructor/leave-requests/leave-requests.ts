import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.html',
  imports :[CommonModule,FormsModule],
  styleUrls: ['./leave-requests.css']
})
export class LeaveRequests {
 
  leaveRequests = [
    { student: 'Rahul', reason: 'Medical', status: 'Pending' },
    { student: 'Sneha', reason: 'Personal', status: 'Pending' }
  ];
 
  approve(req: any) {
    req.status = 'Approved';
  }
 
  reject(req: any) {
    req.status = 'Rejected';
  }
}
