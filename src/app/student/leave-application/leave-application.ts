import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leave-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-application.html',
  styleUrls: ['./leave-application.css']
})
export class LeaveApplication {
  leaveDate: string = '';
  reason: string = '';
  isSubmitted: boolean = false;

  today: string = new Date().toISOString().split('T')[0];

  onSubmit() {
    if (this.leaveDate && this.reason) {
      this.isSubmitted = true;
    } else {
      alert("Please fill in both the date and the reason.");
    }
  }
}
