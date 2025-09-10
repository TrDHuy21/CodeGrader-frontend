import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { InOutExampleItem } from "../../../inOutExampleManage/inOutExample";
import { ApiResponse } from "../../../../user/models/api-respone";
import Swal from "sweetalert2";
import { ProblemItem } from "../../problemManage";
@Component({
    selector: "addExample",
    templateUrl: "addExample.html",
    styleUrl: "addExample.css",
    imports: [ReactiveFormsModule, CommonModule],
    standalone: true
})
export class addExample {
    form = new FormGroup({
        inputExample: new FormControl("", Validators.required),
        outputExample: new FormControl("", Validators.required),
        explanation: new FormControl(""),
    });
    loading = false;
    error = '';
    private problemId: number = 0;
    private problemUrl = 'http://localhost:5000/Problem';
    constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
        this.problemId = this.route.snapshot.paramMap.get("id") ? Number(this.route.snapshot.paramMap.get("id")) : 0;
    }

    onSubmit() {
        if (this.form.invalid) return;

        const example: InOutExampleItem = {
            id: 0,
            inputExample: this.form.value.inputExample!,
            outputExample: this.form.value.outputExample!,
            explanation: this.form.value.explanation ?? "",
            problemId: this.problemId,
            isDelete: false
        };
        this.loading = true
        this.error = ''
        this.http.post<ApiResponse<InOutExampleItem>>(`${this.problemUrl}/InOutExample`, example).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    this.loading = false
                    this.showSuccessAlert('Created!', 'The example has been created!');
                    this.http.get<ApiResponse<ProblemItem>>(`${this.problemUrl}/${this.problemId}`)
                        .subscribe({
                            next: (res) => {
                                if (res.isSuccess && res.data) {
                                    this.loading = false
                                    this.router.navigate(['/updateproblem'], { state: { problem: res.data } });
                                }
                            },
                            error: (err) => {
                                this.error = 'Error get problem: ' + err.message;
                                this.loading = false
                                this.showErrorAlert('Error', this.error);
                            }
                        });
                }
            },
            error: (err) => {
                this.error = 'Error get problem: ' + err.message;
                this.loading = false
                this.showErrorAlert('Error', this.error);
            }
        });
    }
    cancel() {
        this.loading = true
        this.error = ''
        this.http.get<ApiResponse<ProblemItem>>(`${this.problemUrl}/${this.problemId}`)
            .subscribe({
                next: (res) => {
                    if (res.isSuccess && res.data) {
                        this.loading = false
                        this.router.navigate(['/updateproblem'], { state: { problem: res.data } });
                    }
                },
                error: (err) => {
                    this.error = 'Error get problem: ' + err.message;
                    this.loading = false
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