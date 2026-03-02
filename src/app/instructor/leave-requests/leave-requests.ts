import { Component, OnInit, signal } from '@angular/core';
import { LeaveRequestService } from '../../services/leave-request';
import { LeaveRequest } from '../../models/leave-request';
import { NgForm } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-leave-requests',
  imports:[NgFor,NgIf,CommonModule  ],
  templateUrl: './leave-requests.html',
  styleUrls: ['./leave-requests.css']
})
export class LeaveRequestsComponent implements OnInit {
  // Use an array to store the data fetched from the backend
  requests=signal<LeaveRequest[]>([]);

  constructor(private leaveRequestService: LeaveRequestService) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.leaveRequestService.getAllLeaves().subscribe({
      next: (data) => this.requests.set(data),
      error: (err) => console.error('Could not load leaves', err)
    });
  }


}
