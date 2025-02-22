import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isReader: boolean = false;
  constructor(public router: Router,
    private authService: AuthService  
  ) {
    this.isReader = this.authService.getUserRole() === 'reader';
  }

  // Add logout or other functionality if needed
  isAuthenticated() {
    return this.authService.isLoggedIn();
  }

  
   // Navigate to login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
  
  // Navigate to register page
  goToRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToRentals() {
    this.router.navigate(['/reader/rentals']);
  }
}
