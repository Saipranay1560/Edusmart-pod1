import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { AttendanceRecord, AttendanceHistory } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class Attendance {
  constructor(public attendanceService: AttendanceService) {}

  get students(): AttendanceRecord[] {
    return this.attendanceService.getCurrentAttendance();
  }

  get history(): AttendanceHistory[] {
    return this.attendanceService.getAttendanceHistory();
  }

  markPresent(student: AttendanceRecord) {
    const idx = this.students.indexOf(student);
    if (idx !== -1) {
      const updated: AttendanceRecord = { ...student, status: 'Present' };
      this.attendanceService.updateAttendance(idx, updated);
    }
  }

  markAbsent(student: AttendanceRecord) {
    const idx = this.students.indexOf(student);
    if (idx !== -1) {
      const updated: AttendanceRecord = { ...student, status: 'Absent' };
      this.attendanceService.updateAttendance(idx, updated);
    }
  }

  downloadReport() {
    this.attendanceService.exportAttendanceToExcel();
  }
}
