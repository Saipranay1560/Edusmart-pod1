import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private baseUrl = 'http://localhost:1930/api/enrollments';

  constructor(private http: HttpClient) {}

  requestEnrollment(studentId: number, courseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/request`, { studentId, courseId });
  }

  getPendingEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/PENDING`);
  }

  // New function added below
  getStudentsByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/course/${courseId}/students`);
  }

}
