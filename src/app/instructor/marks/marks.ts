import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marks',
  imports: [FormsModule,CommonModule],
  templateUrl: './marks.html',
  styleUrl: './marks.css',
})
export class Marks {
  students=[
    {name:'Rahul',course:'Angular Fundamantals',marks:85},
    {name:'Sneha',course:'java Basics',marks:78},
    {name:'Amit',course:'Angular Fundamentals',marks:92}
  ];
  updateMarks(student: any,value:number){
    student.marks=value;
  }

}
