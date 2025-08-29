import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../user/models/api-respone';
import { HttpParams } from '@angular/common/http';

type SearchQuery = {
  NameSearch: string;
  Levels: number[];
  Tagnames: string[];
  PageNumber: number;
  PageSize: number;
  SortBy: string;
  IsDecending: boolean;
};
@Injectable({ providedIn: 'root' })
export class SearchService {
  private apiUrl = 'http://localhost:5000/problem';
  constructor(private http: HttpClient) {}
  header = new HttpParams();
  getTagname(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Tag`);
  }
  searchWithParams(params: HttpParams) {
    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  search(searchQuery: SearchQuery): Observable<ApiResponse> {
    let params = new HttpParams();

    if (searchQuery.NameSearch) {
      params = params.set('NameSearch', searchQuery.NameSearch);
    }
    if (searchQuery.PageNumber != null) {
      params = params.set('PageNumber', searchQuery.PageNumber.toString());
    }
    if (searchQuery.PageSize != null) {
      params = params.set('PageSize', searchQuery.PageSize.toString());
    }
    if (searchQuery.SortBy) {
      params = params.set('SortBy', searchQuery.SortBy);
    }
    if (searchQuery.IsDecending != null) {
      params = params.set('IsDecending', String(searchQuery.IsDecending));
    }

    if (searchQuery.Levels?.length) {
      searchQuery.Levels.forEach((lv) => {
        params = params.append('Levels', lv.toString());
      });
    }

    if (searchQuery.Tagnames?.length) {
      searchQuery.Tagnames.forEach((tag) => {
        params = params.append('Tagnames', tag);
      });
    }

    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }
}
