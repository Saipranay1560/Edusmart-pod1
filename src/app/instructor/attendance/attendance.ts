import { Component, OnInit, signal, computed } from '@angular/core';
import { AttendanceClientService } from '../../services/attendance-client.service';
import { AttendanceDTO } from '../../models/attendance.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance',
  imports:[FormsModule,CommonModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class AttendanceComponent implements OnInit {
  courseId = 1; // Example ID, fetch from route in production
  selectedDate = signal(new Date().toISOString().split('T')[0]);
  viewMode = signal(false);
  
  // Computed signal to track how many are present
  presentCount = computed(() => 
    this.attendanceService.studentsSignal().filter(s => s.present).length
  );

  constructor(public attendanceService: AttendanceClientService) {}

  ngOnInit() {
    // Load today's students by default for marking
    this.attendanceService.loadStudents(this.courseId);
  }

  /** Load attendance records for selected date in view mode */
  viewAttendanceForDate() {
    const date = this.selectedDate();
    if (!date) return;
    this.attendanceService.viewAttendance(this.courseId, date);
    this.viewMode.set(true);
  }

  /** Switch back to marking mode for the selected date (fresh students list) */
  enterMarkMode() {
    this.attendanceService.loadStudents(this.courseId);
    this.viewMode.set(false);
  }

  toggleAttendance(studentId: number) {
    this.attendanceService.studentsSignal.update(students => 
      students.map(s => s.studentId === studentId ? { ...s, present: !s.present } : s)
    );
  }

  saveAttendance() {
    const data = this.attendanceService.studentsSignal().map(s => ({
      ...s,
      date: this.selectedDate(),
      instructorId: Number(JSON.parse(localStorage.getItem('user') || '{}').id)
    }));
    
    this.attendanceService.submitAttendance(data).subscribe(() => {
      alert('Attendance saved successfully!');
    });
  }
}