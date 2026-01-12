import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Assessment, AssessmentStatus } from '../models/assessment.model';
@Injectable({
 providedIn: 'root'
})
export class AssessmentService {
 private assessments$ = new BehaviorSubject<Assessment[]>([
   {
     assessmentId: 1,
     title: 'Angular Quiz',
     course: 'Angular',
     type: 'QUIZ',
     startDate: '2026-01-10',
     endDate: '2026-01-12',
     maxScore: 50,
     status: AssessmentStatus.DRAFT,
     createdBy: 'Instructor'
   }
 ]);
 getAssessments() {
   return this.assessments$.asObservable();
 }
 publishAssessment(id: number) {
   const updated = this.assessments$.value.map(a =>
     a.assessmentId === id
       ? { ...a, status: AssessmentStatus.PUBLISHED }
       : a
   );
   this.assessments$.next(updated);
 }
 closeAssessment(id: number) {
   const updated = this.assessments$.value.map(a =>
     a.assessmentId === id
       ? { ...a, status: AssessmentStatus.CLOSED }
       : a
   );
   this.assessments$.next(updated);
 }
}