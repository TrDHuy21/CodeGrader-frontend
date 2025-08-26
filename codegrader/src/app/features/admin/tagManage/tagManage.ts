import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AdminNavbar, AdminSidebar } from "../layoutAdminPage";
interface TagItem {
  id: number;
  tagName: string;
  createdBy: string;
  createdDate: string;
  status: "active" | "inactive";
  questionCount: number;
}

@Component({
    selector: "tagmanagepage",
    templateUrl: "tagManage.html",
    styleUrl: "tagManage.css",
    imports: [AdminNavbar, AdminSidebar],
    standalone: true
})
export class TagManage {

     constructor(private router: Router) {}
    isDropdownActive = false;
    searchTerm = '';
    notificationCount = 2;

    tagData: TagItem[] = [
        { id: 1, tagName: 'Java', createdBy: 'Admin', createdDate: '2025-01-05', status: 'active', questionCount: 124 },
        { id: 2, tagName: 'Python', createdBy: 'Admin', createdDate: '2025-01-10', status: 'active', questionCount: 210 },
        { id: 3, tagName: 'Angular', createdBy: 'ModA', createdDate: '2025-02-01', status: 'inactive', questionCount: 48 },
        { id: 4, tagName: 'SQL', createdBy: 'ModB', createdDate: '2025-02-12', status: 'active', questionCount: 76 }
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
            tag.tagName.toLowerCase().includes(this.searchTerm) ||
            tag.createdBy.toLowerCase().includes(this.searchTerm)
        );
    }

    getStatusBadgeClass(status: TagItem["status"]): string {
        return status === 'active' ? 'status-badge status-active' : 'status-badge status-banned';
    }

    getStatusText(status: TagItem["status"]): string {
        return status === 'active' ? 'Active' : 'Inactive';
    }

    onEditTag(tag: TagItem) {
        alert(`Edit tag: ${tag.tagName}`);
    }

    onDeleteTag(tag: TagItem) {
        if (confirm(`Delete tag \"${tag.tagName}\"?`)) {
            this.tagData = this.tagData.filter(t => t.id !== tag.id);
        }
    }

    onToggleTagStatus(tag: any) {
        const action = tag.status === 'inactive' ? 'active' : 'unactive';
        const message = tag.status === 'inactive' ? 'ACtive Tag' : 'Unactive Tag';
        
        if (confirm(`Are you sure you want to ${action} ${tag.tagName}?`)) {
            alert(message);
            // Toggle status
            tag.status = tag.status === 'unactive' ? 'active' : 'unactive';
        }
    }

     // Get lock/unlock icon
    getLockIcon(status: string): string {
        return status === 'inactive' ? 'fas fa-unlock' : 'fas fa-lock';
    }

    getColorIconLock(status: string): string{
        return status === 'inactive' ? 'unlockcolor' : 'lockcolor';
    }
}
