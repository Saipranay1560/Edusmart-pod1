import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface StudentProfile {
  studentId: number;
  studentName: string;
  studentEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {
  private apiUrl = 'http://localhost:1930/api/users/student';

  constructor(private http: HttpClient) {}

  // Get single profile by ID
  getProfileById(studentId: number): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/${studentId}`);
  }
}
