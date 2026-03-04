import { Component, OnInit, AfterViewInit, signal, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsService } from '../../../services/reports.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {

  dashboardStats: any = signal({ totalStudents: 0, totalCourses: 0, totalInstructors: 0, totalEnrollments: 0 });
  // pie chart data from reports
  reportsData = signal<any[]>([]);
  pieChart: any;

  constructor(private ReportsService: ReportsService) {
    // effect will fire whenever reportsData or pieChart changes
    effect(() => {
      const data = this.reportsData();
      if (this.pieChart && data.length) {
        this.updatePieChart();
      }
    });
  }

  ngOnInit() {
    this.fetchDashboardData();
    this.fetchReportData();
  }
  
  // copy of fetchReportData from Reports component adapted
  fetchReportData() {
    this.ReportsService.getAllReports().subscribe({
      next: (data) => {
        this.reportsData.set(data || []);
      },
      error: (err) => console.error('Error fetching reports for pie chart:', err)
    });
  }

  ngAfterViewInit(): void {
    this.initPieChart();
  }

  initPieChart() {
    this.pieChart = new Chart('progressPie', {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444'],
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
    // initial update in case reports already loaded
    this.updatePieChart();
  }

  fetchDashboardData() {
    let data: any;
    this.ReportsService.getDashboardData().subscribe(res => {
      data = res;
      console.log('Dashboard Data:', data);
      this.dashboardStats.set(data);
    });
  }

  private updatePieChart() {
    if (!this.pieChart) {
      return;
    }
    const reports = this.reportsData();
    if (!reports.length) {
      return;
    }
    // use each report's progressPercentage as its own slice
    const labels = reports.map(r => r.courseName || r.studentName || `#${r.studentId}`);
    const data = reports.map(r => r.progressPercentage || 0);
    this.pieChart.data.labels = labels;
    this.pieChart.data.datasets[0].data = data;
    this.pieChart.update();
  }

}
