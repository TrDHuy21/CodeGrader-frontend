import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AdminNavbar, AdminSidebar } from "../layoutAdminPage";
export interface TagItem {
    id: number,
    name: string,
    isDelete: boolean
}

@Component({
    selector: "tagmanagepage",
    templateUrl: "tagManage.html",
    styleUrl: "tagManage.css",
    imports: [AdminNavbar, AdminSidebar],
    standalone: true
})
export class TagManage {

    constructor(private router: Router) { }
    isDropdownActive = false;
    searchTerm = '';
    notificationCount = 2;

    tagData: TagItem[] = [
        { id: 1, name: 'Java', isDelete: true },
        { id: 2, name: 'Python', isDelete: false },
        { id: 3, name: 'Angular', isDelete: false },
        { id: 4, name: 'SQL', isDelete: false }
    ];

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



    onNotificationClick() {
        alert(`You have ${this.notificationCount} new notifications!`);
    }

    onSearchInput(searchTerm: string) {
        this.searchTerm = searchTerm;
    }

    get filteredTags() {
        if (!this.searchTerm) {
            return this.tagData;
        }
        return this.tagData.filter(tag =>
            tag.name.toLowerCase().includes(this.searchTerm)
        );
    }

    getStatusBadgeClass(status: TagItem["isDelete"]): string {
        return status === true ? 'status-badge status-active' : 'status-badge status-banned';
    }

    getStatusText(status: TagItem["isDelete"]): string {
        return status === true ? 'Active' : 'Inactive';
    }

    onEditTag(tag: TagItem) {
        alert(`Edit tag: ${tag.name}`);
    }

    onDeleteTag(tag: TagItem) {
        if (confirm(`Delete tag \"${tag.name}\"?`)) {
            this.tagData = this.tagData.filter(t => t.id !== tag.id);
        }
    }

    onToggleTagStatus(tag: any) {
        const action = tag.isDelete === true ? 'active' : 'unactive';
        const message = tag.isDelete === true ? 'Active Tag' : 'Unactive Tag';

        if (confirm(`Are you sure you want to ${action} ${tag.name}?`)) {
            alert(message);
            // Toggle status
            tag.isDelete = tag.isDelete === false ? true : false;
        }
    }

    // Get lock/unlock icon
    getLockIcon(isDelete: boolean): string {
        return isDelete === false ? 'fas fa-unlock' : 'fas fa-lock';
    }

    getColorIconLock(isDelete: boolean): string {
        return isDelete === false ? 'unlockcolor' : 'lockcolor';
    }
}
