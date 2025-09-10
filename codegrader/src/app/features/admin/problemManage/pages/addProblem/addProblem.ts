import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ProblemItem } from "../../problemManage";
import Swal from "sweetalert2";
import { ApiResponse } from "../../../../user/models/api-respone";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
@Component({
    selector: "addProblem",
    templateUrl: "addProblem.html",
    styleUrl: "addProblem.css",
    imports: [ReactiveFormsModule, CommonModule],
    standalone: true
})
export class addProblem {
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
    problemForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        content: new FormControl('', [Validators.required, Validators.minLength(10)]),
        level: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
        promt: new FormControl('', [Validators.required])
    });
    loading = false;
    error = '';
    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }
    onSubmit() {
        if (this.problemForm.valid) {
            this.loading = true;
            this.error = '';
            this.problem.name = this.problemForm.value.name ?? '';
            this.problem.content = this.problemForm.value.content ?? '';
            this.problem.level = this.problemForm.value.level ?? 1;
            this.problem.promt = this.problemForm.value.promt ?? '';
            this.http.post<ApiResponse<ProblemItem>>(`${this.problemUrl}`, this.problem)
                .subscribe({
                    next: (res) => {
                        if (res.isSuccess && res.data) {
                            this.loading = false
                            this.showSuccessAlert('Created!', 'The problem has been created!');
                            this.router.navigate(['manageproblem']);
                        }
                    },
                    error: (err) => {
                        this.error = 'Error update problem: ' + err.message;
                        this.loading = false
                        this.showErrorAlert('Error', this.error);
                    }
                });
        }
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