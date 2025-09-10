import { Component, computed, signal } from "@angular/core";
import { AdminNavbar, AdminSidebar } from "../../../layoutAdminPage/index";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ProblemItem } from "../../problemManage";
import { Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { ApiResponse } from "../../../../user/models/api-respone";
import { HttpClient } from "@angular/common/http";
import { InOutExampleItem } from "../../../inOutExampleManage/inOutExample";
import Swal from "sweetalert2";
export interface ProblemTagItem {
    ProblemId: number
    TagId: number
    IsDelete: boolean
}
@Component({
    selector: "updateproblempage",
    templateUrl: "updateProblem.html",
    styleUrl: "updateProblem.css",
    imports: [AdminNavbar, AdminSidebar, ReactiveFormsModule, CommonModule],
    standalone: true
})
export class updateProblem {
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
    private problemUrl = 'http://localhost:5000/Problem';
    loading = false;
    error = '';
    constructor(private location: Location, private router: Router, private http: HttpClient) {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras?.state as { problem: ProblemItem };

        if (state && state.problem) {
            this.problem = state.problem;
        } else {
            // Trường hợp reload trang hoặc không có data, bạn có thể fallback gọi API lấy lại data
        }
    }
    formUpdateProblem = new FormGroup({
        id: new FormControl(0),
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        content: new FormControl('', Validators.required),
        level: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
        promt: new FormControl(''),
        tags: new FormArray([]),
        inOutExamples: new FormArray([])
    })

    ngOnInit() {
        if (this.problem) {
            this.formUpdateProblem.patchValue({
                id: this.problem.id,
                name: this.problem.name,
                content: this.problem.content,
                level: this.problem.level,
                promt: this.problem.promt,
            });
            //Tags
            const tags = this.formUpdateProblem.get('tags') as FormArray;
            tags.clear();
            this.problem.tags.forEach(tag => {
                const tagGroup = new FormGroup({
                    id: new FormControl(tag.id),
                    name: new FormControl(tag.name, Validators.required),
                    isDelete: new FormControl(tag.isDelete)
                });
                tags.push(tagGroup);
            });
            //InOut
            const inOuts = this.formUpdateProblem.get('inOutExamples') as FormArray;
            inOuts.clear();
            this.problem.inOutExamples.forEach(inOut => {
                const exampleGroup = new FormGroup({
                    id: new FormControl(inOut.id),
                    inputExample: new FormControl(inOut.inputExample, Validators.required),
                    outputExample: new FormControl(inOut.outputExample, Validators.required),
                    explanation: new FormControl(inOut.explanation),
                    problemId: new FormControl(inOut.problemId),
                    isDelete: new FormControl(inOut.isDelete)
                });
                inOuts.push(exampleGroup);
            })

        }
    }

    removeTag(index: number) {
        this.loading = true;
        this.error = '';
        const tags = this.formUpdateProblem.get('tags') as FormArray;
        const tagRemove = tags.at(index) as FormGroup;
        this.http.delete<ApiResponse<ProblemTagItem>>(`${this.problemUrl}/ProblemTag?ProblemId=${this.problem?.id}&TagId=${tagRemove.value.id}`)
            .subscribe({
                next: (res) => {
                    if (res.isSuccess && res.data) {
                        tags.removeAt(index);
                        this.loading = false
                        this.showSuccessAlert('Deleted!', 'The tag has been removed!');
                    }
                },
                error: (err) => {
                    this.error = 'Error delete tag: ' + err.message;
                    this.loading = false
                    this.showErrorAlert('Error', this.error);
                }
            });


    }

    removeExample(index: number) {
        this.loading = true;
        this.error = '';
        const inOuts = this.formUpdateProblem.get('inOutExamples') as FormArray;
        const inOutRemove = inOuts.at(index) as FormGroup;
        this.http.delete<ApiResponse<InOutExampleItem>>(`${this.problemUrl}/InOutExample/${inOutRemove.value.id}`)
            .subscribe({
                next: (res) => {
                    if (res.isSuccess && res.data) {
                        inOuts.removeAt(index);
                        this.loading = false
                        this.showSuccessAlert('Deleted!', 'The InOut Example has been removed!');
                    }
                },
                error: (err) => {
                    this.error = 'Error delete inOutExample: ' + err.message;
                    this.loading = false
                    this.showErrorAlert('Error', this.error);
                }
            });
    }

    get inOutExamples(): FormArray {
        return this.formUpdateProblem.get('inOutExamples') as FormArray;
    }
    get tags(): FormArray {
        return this.formUpdateProblem.get('tags') as FormArray;
    }

    onSubmit() {
        if (this.formUpdateProblem.invalid) return;
        this.loading = true;
        this.error = '';
        const formValue = this.formUpdateProblem.value;
        this.problem = {
            ...this.problem,
            id: formValue.id!,
            name: formValue.name!,
            content: formValue.content!,
            level: formValue.level!,
            promt: formValue.promt!,
            tags: formValue.tags ?? [],
            inOutExamples: formValue.inOutExamples ?? []
        };
        this.http.put<ApiResponse<ProblemItem>>(`${this.problemUrl}`, this.problem)
            .subscribe({
                next: (res) => {
                    if (res.isSuccess && res.data) {
                        this.loading = false
                        this.showSuccessAlert('Updated!', 'The problem has been updated!');
                    }
                },
                error: (err) => {
                    this.error = 'Error update problem: ' + err.message;
                    this.loading = false
                    this.showErrorAlert('Error', this.error);
                }
            });
    }
    goBack() {
        this.router.navigate(['manageproblem']);
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
    addTag() {
        this.router.navigate(["addTag", this.problem.id]);
    }
    addExample() {
        this.router.navigate(["addExample", this.problem.id]);
    }
}