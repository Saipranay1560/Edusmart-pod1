import { Injectable } from '@angular/core';
import { LeaveRequest } from '../models/leave-request';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  leaveRequests: LeaveRequest[] = [
    { student: 'Rahul', reason: 'Medical', status: 'Pending' },
    { student: 'Sneha', reason: 'Personal', status: 'Pending' }
  ];

  approve(req: LeaveRequest) {
    req.status = 'Approved';
  }

  reject(req: LeaveRequest) {
    req.status = 'Rejected';
  }
}
