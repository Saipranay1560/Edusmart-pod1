
import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../services/exam';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-management.html',
  styleUrls: ['./exam-management.css']
})
export class ExamManagement {
  secure = false;
  remaining = 0;

  constructor(private exam: ExamService) {
    effect(() => {
      this.secure = this.exam.secureMode();
      this.remaining = this.exam.remainingSeconds();
    });
  }

  start() { this.exam.startSecureExam(15); }
  end() { this.exam.endSecureExam(); }
}
