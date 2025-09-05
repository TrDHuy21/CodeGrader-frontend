import { Component, computed, signal } from "@angular/core";
import { AdminNavbar, AdminSidebar } from "../layoutAdminPage";
import { Router } from "@angular/router";
import { TagItem } from "../tagManage/tagManage";
import { InOutExampleItem } from "../inOutExampleManage/inOutExample";
import { ApiResponse } from "../../user/models/api-respone";
import { response } from "express";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ProblemFilter } from "../../problem/components/probem-search";
import { HttpClient } from "@angular/common/http";

export interface ProblemItem {
    id: number,
    name: string,
    content: string,
    level: number,
    promt: string,
    isDelete: boolean,
    tags: TagItem[],
    inOutExamples: InOutExampleItem[],
}

@Component({
    selector: "problemmanagepage",
    templateUrl: "problemManage.html",
    styleUrl: "problemManage.css",
    imports: [AdminNavbar, AdminSidebar, ReactiveFormsModule, CommonModule],
    standalone: true
})
export class ProblemManage {
    private problemUrl = 'https://localhost:7210/api/Problem';
    constructor(private router: Router, private http: HttpClient) { }
    isDropdownActive = false;
    searchTerm = '';
    notificationCount = 2;
    listTag = ['Dynamic Programming', 'Array', 'Graph', 'String', 'Binary Search'];
    levelOptions = ['Easy', 'Medium', 'Hard'];
    filterForm = new FormGroup({
        name: new FormControl(''),
        level: new FormControl([] as string[]),
        sortBy: new FormControl(''),
        isDescending: new FormControl(''),
        pageSize: new FormControl(2),
        tagName: new FormControl([] as string[])
    });
    //Pagination
    totalElement = signal(0);
    currentPage = signal(1);
    pageSize = signal(this.filterForm.get('pageSize')?.value || 1);
    totalPage = computed(() => {
        const total = this.totalElement();
        const pageSize = this.pageSize();
        return Math.ceil(total / pageSize);
    });



    get requestData(): ProblemFilter {
        const formValue = this.filterForm.value;

        return {
            NameSearch: formValue.name || '',
            Levels: formValue.level?.map(level => this.levelOptions.indexOf(level)) || [],
            Tagnames: formValue.tagName || [],
            PageNumber: this.currentPage(),
            PageSize: formValue.pageSize || 1,
            SortBy: formValue.sortBy || '',
            IsDecending: formValue.isDescending === "asc" ? false : true,
        };
    }
    filteredProblems = signal<ProblemItem[]>([]);

    ngOnInit() {
        // this.filterForm.get('pageSize')?.valueChanges.subscribe(value => {
        //     this.pageSize.set(value || 1);
        // });
        this.http.get<ApiResponse<ProblemItem[]>>(`${this.problemUrl}?${this.toQueryParams(this.requestData)}`)
            .subscribe(res => {
                if (res.isSuccess) {
                    this.filteredProblems.set(res.data);
                }
            });
        this.http.get<ApiResponse<number>>(`${this.problemUrl}/total?${this.toQueryParams(this.requestData)}`)
            .subscribe(res => {
                if (res.isSuccess) {
                    this.totalElement.set(res.data);
                    console.log(this.totalElement())
                }
            });
    }

    get pageNumbers(): number[] {
        const current = this.currentPage();
        const total = this.totalPage();

        const start = Math.max(current - 2, 1);
        const end = Math.min(current + 2, total);

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }
    // Navigation methods
    onNavItemClick(path: string) {
        this.router.navigate([path]);
    }

    toggleDropdown() {
        this.isDropdownActive = !this.isDropdownActive;
    }

    closeDropdown() {
        this.isDropdownActive = false;
    }

    onSearchInput(event: string) {
        this.filterForm.patchValue({ name: event });
        this.http.get<ApiResponse<ProblemItem[]>>(`${this.problemUrl}?${this.toQueryParams(this.requestData)}`)
            .subscribe(res => {
                if (res.isSuccess) {
                    this.filteredProblems.set(res.data);
                }
            });
        this.http.get<ApiResponse<number>>(`${this.problemUrl}/total?${this.toQueryParams(this.requestData)}`)
            .subscribe(res => {
                if (res.isSuccess) {
                    this.totalElement.set(res.data);
                    console.log(this.totalElement())
                }
            });
        this.currentPage.set(1);
    }

    onNotificationClick() {
        alert(`You have ${this.notificationCount} new notifications!`);
    }


    get filteredTags() {

        return this.filteredProblems;
    }

    getStatusBadgeClass(status: ProblemItem["isDelete"]): string {
        return status === false ? 'status-badge status-active' : 'status-badge status-banned';
    }

    getStatusText(status: ProblemItem["isDelete"]): string {
        return status === false ? 'Active' : 'Inactive';
    }

    onEditProblem(problem: ProblemItem) {
        alert(`Edit problem: ${problem.name}`);
    }

    onDeleteProblem(problem: ProblemItem) {
        if (confirm(`Delete problem \"${problem.name}\"?`)) {
            this.filteredProblems.set(this.filteredProblems().filter(t => t.id !== problem.id));
        }
    }

    onToggleProblemStatus(problem: any) {
        const action = problem.isDelete === true ? 'active' : 'unactive';
        const message = problem.isDelete === true ? 'Active Problem' : 'Unactive Problem';

        if (confirm(`Are you sure you want to ${action} ${problem.name}?`)) {
            alert(message);
            // Toggle status
            problem.isDelete = problem.isDelete === false ? true : false;
        }
    }

    // Get lock/unlock icon
    getLockIcon(status: boolean): string {
        return status === true ? 'fas fa-unlock' : 'fas fa-lock';
    }

    getColorIconLock(status: boolean): string {
        return status === true ? 'unlockcolor' : 'lockcolor';
    }

    onTagChange(event: any) {
        const selectedTags: string[] = this.filterForm.value.tagName || [];
        if (event.target.checked) {
            selectedTags.push(event.target.value);
        } else {
            const index = selectedTags.indexOf(event.target.value);
            if (index >= 0) selectedTags.splice(index, 1);
        }
        this.filterForm.patchValue({ tagName: selectedTags });

    }
    onLevelChange(event: any) {
        const selectedLevels: string[] = this.filterForm.value.level || [];
        if (event.target.checked) {
            selectedLevels.push(event.target.value);
        } else {
            const index = selectedLevels.indexOf(event.target.value);
            if (index >= 0) selectedLevels.splice(index, 1);
        }
        this.filterForm.patchValue({ level: selectedLevels });
    }
    onSubmit(event: any) {
        event.preventDefault();
        const formPageSize = this.filterForm.get('pageSize')?.value || 1;

        if (formPageSize !== this.pageSize()) {
            this.pageSize.set(formPageSize);
        }
        this.http.get<ApiResponse<ProblemItem[]>>(`${this.problemUrl}?${this.toQueryParams(this.requestData)}`)
            .subscribe(res => {
                if (res.isSuccess) {
                    this.filteredProblems.set(res.data);
                }
            });
        this.http.get<ApiResponse<number>>(`${this.problemUrl}/total?${this.toQueryParams(this.requestData)}`)
            .subscribe(res => {
                if (res.isSuccess) {
                    this.totalElement.set(res.data);
                    console.log(this.totalElement())
                }
            });
        this.currentPage.set(1);
    }
    onPageChange(page: number) {
        this.currentPage.set(page);
        this.http.get<ApiResponse<ProblemItem[]>>(`${this.problemUrl}?${this.toQueryParams(this.requestData)}`)
            .subscribe(res => {
                if (res.isSuccess) {
                    this.filteredProblems.set(res.data);
                }
            });
    }

    toQueryParams(obj: any): string {
        const params = new URLSearchParams();

        for (const key in obj) {
            if (obj[key] == null) continue;
            if (Array.isArray(obj[key])) {
                obj[key].forEach((val: any) => {
                    if (val !== undefined && val !== null) {
                        params.append(key, val.toString());
                    }
                });
            } else {
                params.append(key, obj[key].toString());
            }
        }

        return params.toString();
    }
}