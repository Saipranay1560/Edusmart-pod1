import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsService } from '../../../services/reports.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {

  dashboardStats: any = signal({ totalStudents: 0, totalCourses: 0, totalInstructors: 0, totalEnrollments: 0 });

  constructor(private ReportsService: ReportsService) {}

  ngOnInit() {
    this.fetchDashboardData();
  }
  fetchDashboardData() {
    let data: any;
    this.ReportsService.getDashboardData().subscribe(res => {
      data = res;
      console.log('Dashboard Data:', data);
      this.dashboardStats.set(data);
    });
  }

}
