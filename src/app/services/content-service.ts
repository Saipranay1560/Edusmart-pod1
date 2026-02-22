import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private apiurl = 'http://localhost:1930/api/content';

  constructor(private http: HttpClient) {}

  getContentByCourseId(courseId: number): Observable<any> {
    return this.http.get(`${this.apiurl}/course/${courseId}`);
  }

  addContent( content: any): Observable<any> {
    return this.http.post(`${this.apiurl}/add`, content);
  }

  deleteContent(contentId: number): Observable<any> {
    return this.http.delete(`${this.apiurl}/delete/${contentId}`);
  }

}
