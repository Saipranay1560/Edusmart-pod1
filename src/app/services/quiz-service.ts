import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private httpClient: HttpClient) {
  }
  // Direct backend URL
  baseurl = "http://localhost:1930/api/quizzes";

  saveQuiz(quizdata: any,courseId: number) {
    return this.httpClient.post(`${this.baseurl}/course/${courseId}`,quizdata);

  }

  getQuizzes(courseId: number) {
    return this.httpClient.get(`${this.baseurl}/course/${courseId}`);
  }

  deleteQuiz(courseId: number,quizId: number) {
    // Backend returns plain text on delete (not JSON). Request text response to avoid JSON parse errors.
    return this.httpClient.delete(`${this.baseurl}/course/${courseId}/delete/${quizId}`, { responseType: 'text' as 'json' });
  }

  submitQuiz(submissionData: any): Observable<any> {
    return this.httpClient.post(`${this.baseurl}/submit`, submissionData);
  }
}
