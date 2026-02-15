import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveRequestService } from '../../services/leave-request';
 
@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.html',
  imports :[CommonModule,FormsModule],
  styleUrls: ['./leave-requests.css']
})
export class LeaveRequests {
  constructor(public leaveRequestService: LeaveRequestService) {}

  get leaveRequests() {
    return this.leaveRequestService.leaveRequests;
  }

  approve(req: any) {
    this.leaveRequestService.approve(req);
  }

  reject(req: any) {
    this.leaveRequestService.reject(req);
  }
}
