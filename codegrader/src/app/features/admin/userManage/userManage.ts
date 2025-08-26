import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AdminNavbar, AdminSidebar } from "../layoutAdminPage";

// Định nghĩa interface cho User
interface User {
  avatar: string;
  gender: string;
  fullName: string;
  email: string;
  username: string;
  dateRegister: string;
  status: string;
  projectNumbers: number;
  point: number;
}
@Component({
    selector: "usermanagepage",
    templateUrl: "userManage.html",
    styleUrl: "userManage.css",
    imports: [AdminNavbar, AdminSidebar],
    standalone: true
})
export class UserManage {

    constructor(private router: Router) {}
    // Properties
    isDropdownActive = false;
    searchTerm = '';
    notificationCount = 3;
    
    // Sample user data
    userData: User[]  = [
        {
            avatar: 'B',
            gender: 'male',
            fullName: 'ByeWind',
            email: 'abc@gmail.com',
            username: 'Username1',
            dateRegister: 'Jun 24, 2025',
            status: 'banned',
            projectNumbers: 12,
            point: 500
        },
        {
            avatar: 'N',
            gender: 'female',
            fullName: 'Natali Craig',
            email: 'abc@gmail.com',
            username: 'Username2',
            dateRegister: 'Mar 19, 2025',
            status: 'active',
            projectNumbers: 23,
            point: 1200
        },
        {
            avatar: 'D',
            gender: 'male',
            fullName: 'Drew Cano',
            email: 'abc@gmail.com',
            username: 'Username3',
            dateRegister: 'Nov 10, 2025',
            status: 'active',
            projectNumbers: 16,
            point: 500
        },
        {
            avatar: 'C',
            gender: 'male',
            fullName: 'Orlando Diggs',
            email: 'abc@gmail.com',
            username: 'Username4',
            dateRegister: 'Dec 20, 2025',
            status: 'banned',
            projectNumbers: 9,
            point: 100
        },
        {
            avatar: 'A',
            gender: 'female',
            fullName: 'Andi Lane',
            email: 'abc@gmail.com',
            username: 'Username5',
            dateRegister: 'Jul 25, 2025',
            status: 'active',
            projectNumbers: 8,
            point: 800
        }
    ];

    // Navigation methods
    onNavItemClick(path: string) {
        this.router.navigate([path]);
    }

    // Admin dropdown methods
    toggleDropdown() {
        this.isDropdownActive = !this.isDropdownActive;
    }

    closeDropdown() {
        this.isDropdownActive = false;
    }



    // Notification methods
    onNotificationClick() {
        alert(`You have ${this.notificationCount} new notifications!`);
        // Add your notification logic here
    }

    // Search methods
    onSearchInput(searchTerm: string) {
        this.searchTerm = searchTerm;
    }

    // Filter users based on search term
    get filteredUsers() {
        if (!this.searchTerm) {
            return this.userData;
        }
        
        return this.userData.filter(user => 
            user.fullName.toLowerCase().includes(this.searchTerm) ||
            user.email.toLowerCase().includes(this.searchTerm) ||
            user.username.toLowerCase().includes(this.searchTerm)
        );
    }

    // Action button methods
    onViewUser(user: any) {
        alert(`View details for ${user.fullName}`);
    }

    onToggleUserStatus(user: any) {
        const action = user.status === 'banned' ? 'unban' : 'ban';
        const message = user.status === 'banned' ? 'Unban user' : 'Ban user';
        
        if (confirm(`Are you sure you want to ${action} ${user.fullName}?`)) {
            alert(message);
            // Toggle status
            user.status = user.status === 'banned' ? 'active' : 'banned';
        }
    }

    // Get status badge class
    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'banned':
                return 'status-badge status-banned';
            case 'active':
                return 'status-badge status-active';
            default:
                return 'status-badge status-active';
        }
    }

    // Get status text
    getStatusText(status: string): string {
        switch (status) {
            case 'banned':
                return 'Banned';
            case 'active':
                return 'Active';
            default:
                return 'Active';
        }
    }

    // Get lock/unlock icon
    getLockIcon(status: string): string {
        return status === 'banned' ? 'fas fa-unlock' : 'fas fa-lock';
    }

    getColorIconLock(status: string): string{
        return status === 'banned' ? 'unlockcolor' : 'lockcolor';
    }


    // Get user avatar class
    getUserAvatarClass(gender: string): string {
        return `user-avatar ${gender}`;
    }
}