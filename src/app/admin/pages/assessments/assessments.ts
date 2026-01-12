import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../../services/assessment.service';
import { Assessment } from '../../models/assessment.model';
import { CommonModule } from '@angular/common';
@Component({
 selector: 'app-assessments',
 standalone: true,
 imports:[CommonModule],
 templateUrl: './assessments.html',
 styleUrls: ['./assessments.css']
})
export class AssessmentsComponent implements OnInit {
 assessments: Assessment[] = [];
 constructor(private assessmentService: AssessmentService) {}
 ngOnInit(): void {
   this.assessmentService.getAssessments().subscribe(
     (data: Assessment[]) => {
       this.assessments = data;
     }
   );
 }
 publish(id: number) {
   this.assessmentService.publishAssessment(id);
 }
 close(id: number) {
   this.assessmentService.closeAssessment(id);
 }
}