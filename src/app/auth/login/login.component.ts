import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapGoogle, bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [provideIcons({ bootstrapGoogle, bootstrapGithub })],
})
export class LoginComponent {
  email = '';
  password = '';
  role = 'reader';
  authService = inject(AuthService);
  router = inject(Router);
  apiUrl = environment.apiUrl;

  googleIcon = bootstrapGoogle;
  githubIcon = bootstrapGithub;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      if (this.authService.getUserRole() === 'reader') {
        this.router.navigate(['/reader']);
      } else if (this.authService.getUserRole() === 'owner') {
        this.router.navigate(['/owner']);
      }
    }
  }

  login(event: Event) {
    event.preventDefault();
    this.authService
      .login({ email: this.email, password: this.password, role: this.role })
      .subscribe(
        (response: any) => {
          if (this.role === 'reader') {
            this.router.navigate(['/reader']);
          } else if (this.role === 'owner') {
            this.router.navigate(['/owner']);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  googleLogin() {
    window.location.href = `${this.apiUrl}/auth/login/google`;
  }
  
  githubLogin() {
    window.location.href = `${this.apiUrl}/auth/login/github`;
    }

}
