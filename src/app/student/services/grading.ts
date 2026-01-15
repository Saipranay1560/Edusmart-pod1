
import { Injectable } from '@angular/core';
import { Assessment, QuizResult } from '../shared';

@Injectable({ providedIn: 'root' })
export class GradingService {
  grade(assessment: Assessment, selected: Record<string, number | null>): QuizResult {
    let score = 0;
    for (const q of assessment.questions) {
      const chosen = selected[q.id];
      if (chosen !== null && chosen === q.answerIndex) score += q.marks;
    }
    const percentage = Math.round((score / assessment.maxMarks) * 100);
    const passed = percentage >= 40;
    return {
      assessmentId: assessment.id,
      score,
      maxMarks: assessment.maxMarks,
      percentage,
      passed,
      date: new Date().toISOString()
    };
  }
}
