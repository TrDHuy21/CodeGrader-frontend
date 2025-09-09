import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../user/models/api-respone';
import { GradingModel } from '../models/Grading/grading-model';
@Injectable({ providedIn: 'root' })
export class GradingService {
  private url = 'http://localhost:5000/grading';
  constructor(private http: HttpClient) {}
  post(assignment: string, file: File): Observable<ApiResponse<GradingModel>> {
    const params = new HttpParams().set('assignment', assignment);
    const form = new FormData();
    form.append('formFile', file, file.name);
    return this.http.post<ApiResponse<GradingModel>>(`${this.url}`, form, { params });
  }
}
