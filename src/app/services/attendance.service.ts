import { Injectable } from '@angular/core';
import { AttendanceRecord, AttendanceHistory } from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  // Store history for each student
  private history: AttendanceHistory[] = [
    {
      studentId: 1,
      studentName: 'Rahul',
      records: [
        { studentId: 1, studentName: 'Rahul', name: 'Rahul', date: '2026-02-14', status: 'Present' },
        { studentId: 1, studentName: 'Rahul', name: 'Rahul', date: '2026-02-13', status: 'Absent' }
      ]
    },
    {
      studentId: 2,
      studentName: 'Sneha',
      records: [
        { studentId: 2, studentName: 'Sneha', name: 'Sneha', date: '2026-02-14', status: 'Present' },
        { studentId: 2, studentName: 'Sneha', name: 'Sneha', date: '2026-02-13', status: 'Present' }
      ]
    },
    {
      studentId: 3,
      studentName: 'Amit',
      records: [
        { studentId: 3, studentName: 'Amit', name: 'Amit', date: '2026-02-14', status: 'Present' },
        { studentId: 3, studentName: 'Amit', name: 'Amit', date: '2026-02-13', status: 'Late' }
      ]
    }
  ];

  getCurrentAttendance(): AttendanceRecord[] {
    // Return latest record for each student
    return this.history.map(h => h.records[h.records.length - 1]);
  }

  getAttendanceHistory(): AttendanceHistory[] {
    return this.history;
  }

  addAttendanceRecord(studentId: number, record: AttendanceRecord) {
    const student = this.history.find(h => h.studentId === studentId);
    if (student) {
      student.records.push(record);
    }
  }

  updateAttendance(idx: number, record: AttendanceRecord) {
    // Update latest record for student
    const student = this.history.find(h => h.studentId === record.studentId);
    if (student && student.records.length > 0) {
      student.records[student.records.length - 1] = record;
    }
  }

  exportAttendanceToExcel(): void {
    // Export all records to CSV (Excel-compatible)
    let csv = 'Student Name,Date,Status\n';
    this.history.forEach(h => {
      h.records.forEach(r => {
        csv += `${r.studentName},${r.date},${r.status}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
