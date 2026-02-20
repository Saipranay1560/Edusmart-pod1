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
 view(id: number) {
   // View submitted quiz/assignment responses from students
   console.log('Viewing assessment responses for ID:', id);
  //  this.assessmentService.getAssessmentResponses(id).subscribe(
  //    (responses: any[]) => {
  //      console.log('Assessment responses:', responses);
  //      // TODO: Open a modal or navigate to a detail page to display responses
  //    }
  //  );
 }
}