import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profilePictureUrl: string = 'assets/user.png'; // Default avatar

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: [''],
      name: [''],
      email: [''],
      role: [''],
      password: ['']
    });

    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe(user => {
      console.log(user);
      this.profileForm.patchValue({
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      this.profilePictureUrl = user.profile_picture || 'assets/user.png';
    });
  }

  updateProfile() {
    this.userService.updateUserProfile(this.profileForm.value).subscribe(() => {
      alert('Profile updated successfully!');
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
      this.userService.updateProfilePicture(file).subscribe((response) => {
        this.profilePictureUrl = response.profile_picture_url;
      });
    }
  }
}
