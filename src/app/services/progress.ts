import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentProgress } from '../models/progress.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = 'http://localhost:1930/api/progress'; // Matches your server.port=1930

  constructor(private http: HttpClient) { }

  getCourseProgress(studentId: number, courseId: number): Observable<StudentProgress> {
    return this.http.get<StudentProgress>(`${this.apiUrl}/student/${studentId}/course/${courseId}`);
  }
}
