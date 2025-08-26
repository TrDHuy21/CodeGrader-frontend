import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = route.data['role'];
    const userRole = 'Admin'; // ví dụ: lấy từ token decode

    if (userRole !== expectedRole) {
      this.router.navigate(['/unauthorized']); // hoặc redirect về trang login
      return false;
    }

    return true;
  }
}
