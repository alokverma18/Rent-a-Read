import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  role = 'reader';  // Default role
  authService = inject(AuthService);
  router = inject(Router);

  register(event: Event) {
    event.preventDefault();
    console.log(`Register: ${this.email}, ${this.username}, ${this.password}, ${this.role}`);
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
}
