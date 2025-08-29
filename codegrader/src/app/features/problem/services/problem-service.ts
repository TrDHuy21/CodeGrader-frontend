import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Problem } from '../models/ProblemModel';
import { ApiResponse } from '../../user/models/api-respone';
import { HttpParams } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class ProblemService {
  private apiUrl = 'http://localhost:5000/problem';

  constructor(private http: HttpClient) {}

  getProblems(query: {
    NameSearch?: string;
    Levels?: number[];
    Tagnames?: string[];
    PageNumber?: number;
    PageSize?: number;
  }): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl, { params: query as any });
  }

  getProblemById(id: number): Observable<ApiResponse<Problem>> {
    return this.http.get<ApiResponse<Problem>>(`${this.apiUrl}/${id}`);
  }
}
