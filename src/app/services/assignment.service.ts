import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private apiurl = 'http://localhost:1930/api/assignments';

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
}
