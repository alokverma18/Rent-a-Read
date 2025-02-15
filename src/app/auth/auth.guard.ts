import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role']; // Get the required role from route data
    const isAuthenticated = this.authService.isLoggedIn();
    const userRole = this.authService.getUserRole();
    console.log('User role:', userRole);
    console.log('Expected role:', expectedRole);

    if (!isAuthenticated) {
      // If user is not authenticated, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRole && userRole !== expectedRole) {
      // If the user's role does not match the required role, deny access
      this.router.navigate(['/forbidden']); // Redirect to an error page or home
      return false;
    }

    // If everything checks out, allow access
    return true;
  }
}
