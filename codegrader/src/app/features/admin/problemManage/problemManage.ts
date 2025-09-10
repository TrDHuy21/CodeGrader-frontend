import { Component, computed, signal } from "@angular/core";
import { AdminNavbar, AdminSidebar } from "../layoutAdminPage";
import { Router } from "@angular/router";
import { InOutExampleItem } from "../inOutExampleManage/inOutExample";
import { ApiResponse } from "../../user/models/api-respone";
import { response } from "express";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ProblemFilter } from "../../problem/components/probem-search";
import { HttpClient } from "@angular/common/http";
import Swal from 'sweetalert2';
import { forkJoin } from "rxjs";
import { TagForAdminGet } from "../tagManage/tag.model";
export interface ProblemItem {
    id: number,
    name: string,
    content: string,
    level: number,
    promt: string,
    isDelete: boolean,
    tags: TagForAdminGet[],
    inOutExamples: InOutExampleItem[],
}

@Component({
    selector: "problemmanagepage",
    templateUrl: "problemManage.html",
    styleUrl: "problemManage.css",
    imports: [AdminNavbar, AdminSidebar, ReactiveFormsModule, CommonModule,],
    standalone: true
})
export class ProblemManage {
    private problemUrl = 'http://localhost:5000/Problem';
    constructor(private router: Router, private http: HttpClient) { }
    isDropdownActive = false;
    searchTerm = '';
    notificationCount = 2;
    listTag = signal<string[]>([]);
    levelOptions = ['Easy', 'Medium', 'Hard'];
    loading = false;
    error = '';
    isExpanded = signal(false);

    filterForm = new FormGroup({
        name: new FormControl(''),
        level: new FormControl(['Easy', 'Medium', 'Hard']),
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
        // });this.userService.getAllUsers().subscribe({

        this.loadProblem();
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
        this.loadProblem()
        this.currentPage.set(1);
    }
    loadProblem() {
        this.loading = true;
        this.error = '';
        forkJoin({
            problems: this.http.get<ApiResponse<ProblemItem[]>>(`${this.problemUrl}?${this.toQueryParams(this.requestData)}`),
            total: this.http.get<ApiResponse<number>>(`${this.problemUrl}/total?${this.toQueryParams(this.requestData)}`),
            tags: this.http.get<ApiResponse<TagForAdminGet[]>>(`${this.problemUrl}/Tag`)
        }).subscribe({
            next: ({ problems, total, tags }) => {
                if (problems.isSuccess && problems.data) {
                    this.filteredProblems.set(problems.data);
                }

                if (total.isSuccess) {
                    this.totalElement.set(total.data);
                }

                if (tags.isSuccess && tags.data) {
                    this.listTag.set(tags.data.map(t => t.name));
                }

                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error loading data: ' + err.message;
                this.loading = false;
                this.showErrorAlert('Error', this.error);
            }
        });
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
        this.router.navigate(['/updateproblem'], { state: { problem } });
    }
    deleteProblem(problem: ProblemItem) {
        this.http.delete<ApiResponse<ProblemItem>>(`${this.problemUrl}/${problem.id}`)
            .subscribe({
                next: (res) => {
                    if (res.isSuccess && res.data) {
                        this.filteredProblems.set(this.filteredProblems().filter(t => t.id !== problem.id));
                        this.totalElement.set(this.totalElement() - 1);
                        this.currentPage.set(1);
                        this.showSuccessAlert('Deleted!', 'The problem has been deleted.');
                    }
                },
                error: (err) => {
                    this.error = 'Error delete data: ' + err.message;
                    this.showErrorAlert('Error', this.error);
                }
            });
    }

    onDeleteProblem(problem: ProblemItem) {
        Swal.fire({
            title: `Delete "${problem.name}"?`,
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteProblem(problem);
            }
        });
    }

    onToggleProblemStatus(problem: ProblemItem) {
        const action = problem.isDelete === true ? 'active' : 'unactive';
        const message = problem.isDelete === true ? 'Active Problem' : 'Unactive Problem';
        Swal.fire({
            title: `Are you sure you want to ${action} ${problem.name}?`,
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Yes,${action} it!`
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedProblem = {
                    ...problem,
                    isDelete: !problem.isDelete
                };
                this.http.put<ApiResponse<ProblemItem>>(`${this.problemUrl}`, updatedProblem)
                    .subscribe({
                        next: (res) => {
                            if (res.isSuccess && res.data) {
                                problem.isDelete = problem.isDelete === false ? true : false;
                                this.showSuccessAlert('Updated!', 'The problem has been updated.');
                            }
                        },
                        error: (err) => {
                            this.error = 'Error delete data: ' + err.message;
                            this.showErrorAlert('Error', this.error);
                        }
                    });
            }
        });
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
        this.loadProblem()
        this.currentPage.set(1);
    }
    onPageChange(page: number) {
        this.currentPage.set(page);
        this.loading = true;
        this.error = '';
        this.http.get<ApiResponse<ProblemItem[]>>(`${this.problemUrl}?${this.toQueryParams(this.requestData)}`)
            .subscribe({
                next: (res) => {
                    if (res.isSuccess && res.data) {
                        this.filteredProblems.set(res.data);
                    }
                    this.loading = false
                },
                error: (err) => {
                    this.error = 'Error loading data: ' + err.message;
                    this.loading = false;
                    this.showErrorAlert('Error', this.error);
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

    showSuccessAlert(title: string, message: string) {
        Swal.fire({
            title: title,
            text: message,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#10b981',
            background: '#ffffff',
            backdrop: 'rgba(0,0,0,0.4)',
            timer: 3000,
            timerProgressBar: true
        });
    }

    showErrorAlert(title: string, message: string) {
        Swal.fire({
            title: title,
            text: message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444',
            background: '#ffffff',
            backdrop: 'rgba(0,0,0,0.4)'
        });
    }

    toggleExpand() {
        this.isExpanded.update(value => !value);
    }
    onAddProblem() {
        this.router.navigate(['addProblem']);
    }
}