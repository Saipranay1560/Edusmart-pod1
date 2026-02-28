import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EnrollmentResponse {
  id: number;
  studentId: number;
  studentName: string;
  courseName: string;
  enrolledDate: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:1930/api/enrollments/all';

  constructor(private http: HttpClient) { }

  getAllEnrollments(): Observable<EnrollmentResponse[]> {
    return this.http.get<EnrollmentResponse[]>(this.apiUrl);
  }
}