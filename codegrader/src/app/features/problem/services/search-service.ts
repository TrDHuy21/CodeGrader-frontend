import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../user/models/api-respone';
import { HttpParams } from '@angular/common/http';

export interface SearchQuery {
  NameSearch: string;
  Levels: number[];
  Tagnames: string[];
  PageNumber: number;
  PageSize: number;
  SortBy: string;
  IsDecending: boolean;
}
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjIiLCJVc2VybmFtZSI6InVzZXIiLCJyb2xlIjoiVXNlciIsIm5iZiI6MTc1Njk5OTMxNSwiZXhwIjoxNzU3MDAyOTE1LCJpYXQiOjE3NTY5OTkzMTUsImlzcyI6Iklzc3VlciIsImF1ZCI6Ik15QXVkaWVuY2UifQ.OeySX3nbyr_U9IfGsCraqmi-IR0Zli5YPY2jJ1Ird9c';
@Injectable({ providedIn: 'root' })
export class SearchService {
  private apiUrl = 'http://localhost:5000/problem';
  constructor(private http: HttpClient) {}
  header = new HttpParams();
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });
  getTagname(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Tag`);
  }
  searchWithParams(params: HttpParams) {
    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }
  search(searchQuery: SearchQuery): Observable<ApiResponse> {
    const baseQuery = Object.fromEntries(
      Object.entries(searchQuery)
        .filter(
          ([key, value]) =>
            value != null && !Array.isArray(value) && key !== 'Levels' && key !== 'Tagnames'
        )
        .map(([key, value]) => [key, String(value)])
    );

    let params = new HttpParams({ fromObject: baseQuery });

    // xử lý array riêng
    searchQuery.Levels?.forEach((lv) => {
      params = params.append('Levels', lv.toString());
    });

    searchQuery.Tagnames?.forEach((tag) => {
      params = params.append('Tagnames', tag);
    });

    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }
  statisticTag(tagId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/ProblemTag/Statistics/${tagId}`);
  }
}
