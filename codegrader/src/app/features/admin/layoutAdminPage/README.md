# Admin Layout Components

Thư mục này chứa các components layout dùng chung cho các trang admin.

## Components

### 1. AdminNavbar
Component navbar cho admin page với các chức năng:
- Search box
- Notification button
- Admin profile dropdown

**Tự động xử lý:**
- **Logout**: Hiển thị confirm dialog với SweetAlert2, xử lý logout và redirect về `/login`
- **Profile & Settings**: Emit event để parent component xử lý (nếu cần)

**Usage:**
```html
<admin-navbar
  searchPlaceholder="Search tags..."
  [notificationCount]="notificationCount"
  [isDropdownActive]="isDropdownActive"
  (searchChange)="onSearchInput($event)"
  (notificationClick)="onNotificationClick()"
  (dropdownToggle)="toggleDropdown()"
></admin-navbar>
```

**Inputs:**
- `searchPlaceholder`: Placeholder text cho search box
- `notificationCount`: Số lượng notification
- `isDropdownActive`: Trạng thái dropdown

**Outputs:**
- `searchChange`: Emit khi user nhập text search
- `notificationClick`: Emit khi click notification button
- `dropdownToggle`: Emit khi toggle dropdown

### 2. AdminSidebar
Component sidebar cho admin page với navigation menu.

**Usage:**
```html
<admin-sidebar 
  [activeRoute]="'/managetag'"
  (navItemClick)="onNavItemClick($event)"
></admin-sidebar>
```

**Inputs:**
- `activeRoute`: Route hiện tại để highlight menu item

**Outputs:**
- `navItemClick`: Emit khi click navigation item

## Cách sử dụng trong component

1. Import components:
```typescript
import { AdminNavbar, AdminSidebar } from "../layoutAdminPage";
```

2. Thêm vào imports của component:
```typescript
@Component({
  selector: "your-component",
  templateUrl: "your-template.html",
  styleUrl: "your-style.css",
  imports: [AdminNavbar, AdminSidebar],
  standalone: true
})
```

3. Sử dụng trong template:
```html
<div class="container">
  <admin-sidebar 
    [activeRoute]="'/your-route'"
    (navItemClick)="onNavItemClick($event)"
  ></admin-sidebar>

  <div class="section2">
    <admin-navbar
      searchPlaceholder="Search..."
      [notificationCount]="notificationCount"
      [isDropdownActive]="isDropdownActive"
      (searchChange)="onSearchInput($event)"
      (notificationClick)="onNotificationClick()"
      (dropdownToggle)="toggleDropdown()"
    ></admin-navbar>
    
    <!-- Your content here -->
  </div>
</div>
```

4. Xử lý events trong component:
```typescript
// Chỉ cần xử lý các events cần thiết
onNavItemClick(path: string) {
  this.router.navigate([path]);
}

onSearchInput(searchTerm: string) {
  // Xử lý search logic
}

onNotificationClick() {
  // Xử lý notification logic
}

toggleDropdown() {
  this.isDropdownActive = !this.isDropdownActive;
}

// Logout, Profile, Settings được xử lý tự động bởi AdminNavbar
```

## Dependencies

Để sử dụng AdminNavbar với SweetAlert2, cần cài đặt:

```bash
npm install sweetalert2
```

## Lợi ích

- **Tái sử dụng**: Có thể dùng chung cho tất cả trang admin
- **Dễ bảo trì**: Chỉ cần sửa một chỗ cho tất cả trang
- **Consistent UI**: Đảm bảo UI nhất quán giữa các trang
- **Responsive**: Đã được tối ưu cho mobile
- **Tự động xử lý**: Logout được xử lý hoàn toàn tự động
