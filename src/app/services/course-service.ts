import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface Course {
  id: number;
  name: string;
  category: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  // signal holding the current course list
  courses = signal<Course[]>([]);

  // Use relative path so the dev server proxy (proxy.conf.json) can forward requests and avoid CORS
  private baseUrl = 'http://localhost:1930/api/courses';
  private baseUrl2 = 'http://localhost:1930/api/enrollments';

  constructor(private http: HttpClient) {
    // load initial data
    this.loadAll();
  }

  loadAll() {
    this.http.get<Course[]>(this.baseUrl).subscribe({
      next: (list) => {
        this.courses.set(list || [])
        console.log('Courses loaded:', list);
      },
      error: (err) => {
        console.error('Failed loading courses:', err);
        this.courses.set([]);
      },
    });
  }

  getByStatus(status: string) {
    return this.http.get<Course[]>(`${this.baseUrl}/${status}`).pipe(
      tap({
        next: (res) => console.log(`getByStatus(${status})`, res),
        error: (err) => console.error(`getByStatus(${status}) failed:`, err)
      })
    );
  }

  getCourseById(courseId: number) {
    return this.http.get<any>(`${this.baseUrl}/course/${courseId}`).pipe(
      tap({
        next: (res) => console.log(`getCourseById(${courseId})`, res),
        error: (err) => console.error(`getCourseById(${courseId}) failed:`, err)
      })
    );
  }

  getEnrolledCourseById(id: number) {
    return this.http.get<Course>(`${this.baseUrl2}/student/${id}`).pipe(
      tap({
        next: (res) => console.log(`getEnrolledCourseById(${id})`, res),
        error: (err) => console.error(`getEnrolledCourseById(${id}) failed:`, err)
      })
    );
  }

  getByStatusAndEnrollment(studentId:number) {
    return this.http.get<Course[]>(`${this.baseUrl}/not-enrolled/${studentId}`).pipe(
      tap({
        next: (res) => console.log(`getByStatusAndEnrollment(${studentId})`, res),
        error: (err) => console.error(`getByStatusAndEnrollment(${studentId}) failed:`, err)
      })
    );
  }

  add(courseDto: Partial<Course>) {
    return this.http.post<Course>(`${this.baseUrl}/add`, courseDto).pipe(
      tap(() => this.loadAll())
    );
  }

  updateStatus(id: number, status: string) {
    // backend expects PUT /api/courses/update/{id}/{status}
    return this.http.put<Course>(`${this.baseUrl}/update/${id}/${status}`, null).pipe(
      tap(() => this.loadAll())
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadAll())
    );
  }
}
