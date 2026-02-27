import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest } from '../models/leave-request';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private apiUrl = 'http://localhost:1930/api/leaves'; // Matches server.port in application.properties

  constructor(private http: HttpClient) {}

  // POST: /api/leaves/apply
  applyLeave(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}/apply`, request);
  }

  // GET: /api/leaves/all
  getAllLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/all`);
  }
}
