import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-respone';
export interface SubmissionRequest {
  userId: number;
  problemId: number;
  programmingLanguage: string;
  point: number;
  evaluationCriteria: {
    algorithm: string;
    cleanCode: string;
  };
  submissionAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserSubmissionService {
  private url = 'http://localhost:5000/progress/Submission';
  constructor(private http: HttpClient) {}

  getSubmissionByUserId(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.url}/userId`);
  }
  postSubmission(body: SubmissionRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}`, body);
  }
}
