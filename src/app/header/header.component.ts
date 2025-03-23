import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../profile/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isReader: boolean = false;
  profilePictureUrl: string = 'assets/user.png'; 
  dropdownOpen: boolean = false; // Dropdown state

  constructor(
    public router: Router,
    private authService: AuthService,
    private userService: UserService 
  ) {}

  ngOnInit() {
    this.isReader = this.authService.getUserRole() === 'reader';

    if (this.isAuthenticated()) {
      this.userService.getUserProfile().subscribe(user => {
        this.profilePictureUrl = user.profile_picture || 'assets/user.png';
      });
    }
  }

  isAuthenticated() {
    return this.authService.isLoggedIn();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

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

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleTheme() {
    console.log('Toggling theme...');
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
