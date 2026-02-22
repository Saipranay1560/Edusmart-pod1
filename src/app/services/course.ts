import { Injectable } from '@angular/core';
import { Course } from '../models/courses';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:1930/api/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  addCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/add`, course);
  }

  publishCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/update/${course.id}/Published`, {});
  }

  archiveCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/update/${course.id}/Archived`, {});
  }
}


