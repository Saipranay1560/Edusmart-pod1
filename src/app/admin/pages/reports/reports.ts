import { Component, OnInit, AfterViewInit, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ReportsService } from '../../../services/reports.service';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit, AfterViewInit {
  // Using Signals for data state
  reports = signal<any[]>([]);
  chart: any;

  constructor(private reportsService: ReportsService) {
    // Effect runs automatically whenever 'reports' signal changes
    effect(() => {
      this.updateChart(this.reports());
    });
  }

  ngOnInit(): void {
    this.fetchReportData();
  }

  fetchReportData() {
    this.reportsService.getAllReports().subscribe({
      next: (data) => {
        console.log('Fetched reports:', data);
        this.reports.set(data); // Updating the signal
      },
      error: (err) => console.error('Error fetching reports:', err)
    });
  }

  downloadReport() {
    const data = this.reports();
    if (data.length === 0) return;

    const header = ['Student', 'Course', 'Progress %'];
    const rows = data.map(r => [
      r.studentName, 
      r.courseName, 
      r.progressPercentage
    ]);
    
    let csvContent = header.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Grade_Report.csv');
    link.click();
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart() {
    this.chart = new Chart('performanceChart', {
      type: 'bar', // Changed to bar as it fits course progress better
      data: {
        labels: [],
        datasets: [{
          label: 'Progress Percentage',
          data: [],
          backgroundColor: '#2563eb',
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  updateChart(data: any[]) {
    if (this.chart && data.length > 0) {
      this.chart.data.labels = data.map(r => r.courseName);
      this.chart.data.datasets[0].data = data.map(r => r.progressPercentage);
      this.chart.update();
    }
  }
}