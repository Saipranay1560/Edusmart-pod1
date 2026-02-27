import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
    constructor(private httpClient: HttpClient) {}

    private baseurl = "http://localhost:1930/api/reports";
    getAllReports(): Observable<any> {
        return this.httpClient.get(`${this.baseurl}/all-students`);
    }

}
