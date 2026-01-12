import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
   reports = [
   {
     studentName: 'John Doe',
     courseName: 'Angular Fundamentals',
     assessmentType: 'Quiz',
     score: 85,
     maxScore: 100,
     grade: 'A',
     completionRate: '95%',
     date: '12 Jan 2026'
   },
   {
     studentName: 'Jane Smith',
     courseName: 'Data Science Basics',
     assessmentType: 'Exam',
     score: 72,
     maxScore: 100,
     grade: 'B',
     completionRate: '88%',
     date: '10 Jan 2026'
   },
   {
     studentName: 'Rahul Kumar',
     courseName: 'AI & ML',
     assessmentType: 'Exam',
     score: 60,
     maxScore: 100,
     grade: 'C',
     completionRate: '80%',
     date: '08 Jan 2026'
   }
 ];
 downloadReport() {
   const header = [
     'Student',
     'Course',
     'Assessment',
     'Score',
     'Max Score',
     'Grade',
     'Completion Rate',
     'Date'
   ];
   const rows = this.reports.map(r => [
     r.studentName,
     r.courseName,
     r.assessmentType,
     r.score,
     r.maxScore,
     r.grade,
     r.completionRate,
     r.date
   ]);
   let csvContent =
     header.join(',') +
     '\n' +
     rows.map(row => row.join(',')).join('\n');
   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
   const url = URL.createObjectURL(blob);
   const link = document.createElement('a');
   link.href = url;
   link.setAttribute('download', 'Grade_Report.csv');
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 }
  ngAfterViewInit(): void {
   this.loadChart();
 }
 loadChart() {
   new Chart('performanceChart', {
     type: 'line',
     data: {
       labels: ['8 Jan', '10 Jan', '12 Jan'],
       datasets: [
         {
           label: 'Average Score',
           data: [60, 72, 85],
           borderColor: '#2563eb',
           backgroundColor: 'rgba(37, 99, 235, 0.15)',
           tension: 0.4,
           fill: true,
           pointRadius: 5
         }
       ]
     },
     options: {
       responsive: true,
       plugins: {
         legend: {
           display: true
         }
       },
       scales: {
         y: {
           beginAtZero: true,
           max: 100,
           title: {
             display: true,
             text: 'Score'
           }
         }
       }
     }
   });
 }


}
