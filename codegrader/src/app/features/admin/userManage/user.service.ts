import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import {
  Observable,
  tap,
  BehaviorSubject,
  map,
} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ApiResponse } from '../../user/models/api-respone';
import { AdminGetUserResponse, UserForAdminGet } from './userAdminModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/admin/user';
  private usersSubject = new BehaviorSubject<UserForAdminGet[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Get all users from API
  getAllUsers(): Observable<AdminGetUserResponse> {
    return this.http.get<AdminGetUserResponse>(this.apiUrl).pipe(
      tap(response => {
        if (response.isSuccess && response.data) {
          this.usersSubject.next(response.data);
        }
      })
    );
  }


  //Lam
  // Get users with pagination
  getUsersWithPagination(page: number, pageSize: number, searchTerm: string = ''): Observable<{
    users: UserForAdminGet[];
    totalUsers: number;
    currentPage: number;
    totalPages: number;
  }> {
    return this.users$.pipe(
      map(users => {
        // Filter users based on search term
        let filteredUsers = users;
        if (searchTerm.trim()) {
          filteredUsers = users.filter(user => 
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        const totalUsers = filteredUsers.length;
        const totalPages = Math.ceil(totalUsers / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        return {
          users: paginatedUsers,
          totalUsers,
          currentPage: page,
          totalPages
        };
      })
    );
  }

  // Toggle user status (ban/unban)
  toggleUserStatus(userId: number, isActive: boolean): Observable<any> {
    if(isActive)
    {
      return this.http.put(`${this.apiUrl}/lock/${userId}`, {});
    }
    else
    {
      return this.http.put(`${this.apiUrl}/unlock/${userId}`, {});
    }
  }

  // Refresh users data
  refreshUsers(): void {
    this.getAllUsers().subscribe();
  }
}