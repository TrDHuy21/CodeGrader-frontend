import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../user/models/api-respone';
import { GradingModel } from '../models/Grading/grading-model';
@Injectable({ providedIn: 'root' })
export class GradingService {
  private url = 'http://localhost:5000/grading';
  constructor(private http: HttpClient) {}
  post(assignment: string, files: File[]): Observable<ApiResponse<GradingModel>> {
    const form = new FormData();

    for (const f of files) {
      console.log(f.name);
      form.append('formFiles', f, f.name); // ✅ phải khớp tên 'formFiles'
    }

    const params = new HttpParams().set('assignment', assignment);

    return this.http.post<ApiResponse<GradingModel>>(`${this.url}`, form, { params });
  }
  post2(
    assignment: string,
    problemId: number,
    files: File[]
  ): Observable<ApiResponse<GradingModel>> {
    const form = new FormData();

    for (const f of files) {
      console.log(f.name);
      form.append('formFiles', f, f.name); // phải khớp tên 'formFiles'
    }

    const params = new HttpParams().set('assignment', assignment);

    // problemId nằm trong path chứ không phải query
    return this.http.post<ApiResponse<GradingModel>>(`${this.url}/${problemId}`, form, {
      params,
    });
  }
}
