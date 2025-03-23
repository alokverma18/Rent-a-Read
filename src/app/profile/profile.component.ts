import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profilePictureUrl: string = 'assets/user.png';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
      created_at: ['', Validators.required],
      password: ['']
    });

    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe(user => {
      this.profileForm.patchValue({
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      });
      this.profilePictureUrl = user.profile_picture || 'assets/user.png';
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.snackBar.open('Please fill in all required fields!', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }
    this.userService.updateUserProfile(this.profileForm.value).subscribe(() => {
      this.snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
      this.userService.updateProfilePicture(file).subscribe((response) => {
        this.profilePictureUrl = response.profile_picture_url;
        this.ngOnInit();
        this.snackBar.open('Profile picture updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      });
    }
  }  
}
