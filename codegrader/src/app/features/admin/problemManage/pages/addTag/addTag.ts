import { Component, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { ApiResponse } from "../../../../user/models/api-respone";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { ProblemTagItem } from "../updateProblem/updateProblem";
import { forkJoin } from "rxjs";
import { Router } from "@angular/router";
import { ProblemItem } from "../../problemManage";
import { TagForAdminGet } from "../../../tagManage/tag.model";
@Component({
    selector: "addTag",
    templateUrl: "addTag.html",
    styleUrl: "addTag.css",
    imports: [ReactiveFormsModule, CommonModule],
    standalone: true
})
export class addTag {
    problemId = signal(0);
    availableTags = signal([] as TagForAdminGet[])
    selectedTags: TagForAdminGet[] = [];
    private problemUrl = 'http://localhost:5000/Problem';
    loading = false;
    error = '';
    problemTag: ProblemTagItem = {
        ProblemId: 0,
        TagId: 0,
        IsDelete: false
    }
    problem: ProblemItem = {
        id: 0,
        name: '',
        content: '',
        level: 1,
        promt: '',
        isDelete: false,
        tags: [],
        inOutExamples: []
    };
    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }



    ngOnInit() {
        this.loading = true;
        this.error = '';
        this.problemId.set(this.route.snapshot.paramMap.get("id") ? Number(this.route.snapshot.paramMap.get("id")) : 0);
        this.http.get<ApiResponse<TagForAdminGet[]>>(`${this.problemUrl}/Tag/GetTagsNotInProblem/${this.problemId()}`)
            .subscribe({
                next: (res) => {
                    if (res.isSuccess && res.data) {
                        this.availableTags.set(res.data)
                        this.loading = false

                    }
                },
                error: (err) => {
                    this.error = 'Error update problem: ' + err.message;
                    this.loading = false
                    this.showErrorAlert('Error', this.error);
                }
            });

    }



    isSelected(tag: TagForAdminGet): boolean {
        return this.selectedTags.includes(tag);
    }

    toggleTag(tag: TagForAdminGet) {
        if (this.isSelected(tag)) {
            this.selectedTags = this.selectedTags.filter(t => t !== tag);
        } else {
            this.selectedTags.push(tag);
        }
    }

    removeTag(tag: TagForAdminGet) {
        this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }

    onSubmit(event: Event) {
        event.preventDefault()
        this.loading = true
        const requests = this.selectedTags.map(tag => {
            const problemTag: ProblemTagItem = {
                ProblemId: this.problemId(),
                TagId: tag.id,
                IsDelete: false
            };
            return this.http.post<ApiResponse<ProblemTagItem>>(`${this.problemUrl}/ProblemTag`, problemTag);
        });

        forkJoin(requests).subscribe({
            next: (results) => {
                this.loading = false;
                this.showSuccessAlert('Complete Save !', 'All tags saved')
                this.http.get<ApiResponse<ProblemItem>>(`${this.problemUrl}/${this.problemId()}`)
                    .subscribe({
                        next: (res) => {
                            if (res.isSuccess && res.data) {
                                this.problem = res.data
                                this.loading = false
                                this.router.navigate(['/updateproblem'], { state: { problem: this.problem } });
                            }
                        },
                        error: (err) => {
                            this.error = 'Error get problem: ' + err.message;
                            this.loading = false
                            this.showErrorAlert('Error', this.error);
                        }
                    });


            },
            error: (err) => {
                this.error = 'Error update problem: ' + err.message;
                this.loading = false;
                this.showErrorAlert('Error', this.error);
            }
        });



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
}