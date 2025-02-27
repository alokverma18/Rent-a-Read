import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapGoogle, bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [provideIcons({ bootstrapGoogle, bootstrapGithub })],
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  role = 'reader';  // Default role
  authService = inject(AuthService);
  router = inject(Router);
  apiUrl = environment.apiUrl;

  googleIcon = bootstrapGoogle;
  githubIcon = bootstrapGithub;

  register(event: Event) {
    event.preventDefault();
  
    this.authService
      .register({
        email: this.email,
        username: this.username,
        password: this.password,
        role: this.role,  // Include the role
      })
      .subscribe(() => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      });
  }
  googleRegister() {
    window.location.href = `${this.apiUrl}/auth/login/google`;
  }
  
  githubRegister() {
    window.location.href = `${this.apiUrl}/auth/login/github`;
    }
}
