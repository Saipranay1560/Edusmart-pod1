import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceDTO } from '../models/attendance.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AttendanceClientService {
  private apiUrl = 'http://localhost:1930/api/attendance';

  studentsSignal = signal<AttendanceDTO[]>([]);

  constructor(private http: HttpClient) {}

  loadStudents(courseId: number) {
    this.http.get<AttendanceDTO[]>(`${this.apiUrl}/course/${courseId}/students`)
      .subscribe(data => this.studentsSignal.set(data || []));
  }

  viewAttendance(courseId: number, date: string): Observable<AttendanceDTO[]> {
    const obs = this.http.get<AttendanceDTO[]>(`${this.apiUrl}/course/${courseId}/view?date=${encodeURIComponent(date)}`);
    obs.subscribe({
      next: (data) => this.studentsSignal.set(data || []),
      error: (err) => {
        console.error('Failed to load historical attendance', err);
        this.studentsSignal.set([]);
      }
    });
    return obs;
  }

  submitAttendance(attendanceData: AttendanceDTO[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-bulk`, attendanceData, { responseType: 'text' });
  }
}
