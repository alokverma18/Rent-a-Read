import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public router: Router,
    private authService: AuthService
  ) {}

  isReader : boolean = this.isAuthenticated() && this.authService.getUserRole() === 'reader';

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
