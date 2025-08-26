import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Problem } from '../models/ProblemModel';
import { ApiResponse } from '../../user/models/api-respone';

@Injectable({ providedIn: 'root' })
export class ProblemService {
  private apiUrl = 'http://localhost:5000/problem';

  constructor(private http: HttpClient) {}

  getProblems(): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.apiUrl);
  }

  getProblemById(id: number): Observable<ApiResponse<Problem>> {
    return this.http.get<ApiResponse<Problem>>(`${this.apiUrl}/${id}`);
  }
}
