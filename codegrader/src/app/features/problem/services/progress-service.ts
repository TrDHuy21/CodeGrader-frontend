import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ProgressSerivce {
  private url = 'http://localhost:5000/progress';
  constructor(private http: HttpClient) {}

  
}
