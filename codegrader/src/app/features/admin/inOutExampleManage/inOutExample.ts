import { Component } from "@angular/core";
import { AdminNavbar, AdminSidebar } from "../layoutAdminPage";
export interface InOutExampleItem {
    id: number,
    inputExample: string,
    outputExample: string,
    explanation: string,
    problemId: number,
    isDelete: boolean,
}

@Component({
    selector: "inoutexamplemanagepage",
    templateUrl: "inOutExample.html",
    styleUrl: "inOutExample.css",
    imports: [AdminNavbar, AdminSidebar],
    standalone: true
})
export class InOutExampleManage {


}