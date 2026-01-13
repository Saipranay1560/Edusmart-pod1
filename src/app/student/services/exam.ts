
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExamService {
  // Simple "secure mode" flag and countdown timer (seconds)
  secureMode = signal(false);
  remainingSeconds = signal(0);
  private timerId?: number;

  startSecureExam(durationMinutes = 15) {
    this.secureMode.set(true);
    this.remainingSeconds.set(durationMinutes * 60);
    this.clearTimer();
    this.timerId = window.setInterval(() => {
      const next = this.remainingSeconds() - 1;
      this.remainingSeconds.set(Math.max(0, next));
      if (next <= 0) this.endSecureExam();
    }, 1000);

    // Very lightweight "lock": prompt on navigation/close
    window.onbeforeunload = () => 'Secure exam in progress. Are you sure you want to leave?';
    document.body.classList.add('secure-exam');
  }

  endSecureExam() {
    this.secureMode.set(false);
    this.clearTimer();
    window.onbeforeunload = null;
    document.body.classList.remove('secure-exam');
  }

  private clearTimer() {
    if (this.timerId) { clearInterval(this.timerId); this.timerId = undefined; }
  }
}
