import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private apiurl = 'http://localhost:1930/api/assignments';
  private baseUrl = 'http://localhost:1930/api/assignments';

  constructor(private http: HttpClient) {}

  getAssignmentsByCourseId(courseId: number): Observable<any> {
    return this.http.get(`${this.apiurl}/course/${courseId}`);
  }

  addAssignment(assignment: any): Observable<any> {
    return this.http.post(`${this.apiurl}/add`, assignment);
  }

  updateAssignment(assignmentId: number, assignment: any): Observable<any> {
    return this.http.put(`${this.apiurl}/update/${assignmentId}`, assignment);
  }

  deleteAssignment(courseId: number, assignmentId: number): Observable<any> {
    return this.http.delete(`${this.apiurl}/course/${courseId}/delete/${assignmentId}`, { responseType: 'text' });
  }

  submitAssignment(submissionData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit`, submissionData);
  }

 getSubmissionsByAssignmentId(assignmentId: number): Observable<any[]> {
  // Hits: http://localhost:1930/api/assignments/submit/123
  return this.http.get<any[]>(`${this.baseUrl}/submit/${assignmentId}`);
}

}
