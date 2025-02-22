import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-google-auth-callback',
  template: `<p>Processing Google Login...</p>`
})
export class GoogleAuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const refreshToken = params['refresh_token'];
      const role = params['role'];

      console.log(accessToken, refreshToken, role);
      if (accessToken) {
        this.authService.googleLogin(JSON.stringify({ access_token: accessToken, refresh_token: refreshToken, role: role }));
        this.router.navigate(['/reader']); // Redirect to dashboard after login
      } else {
        this.router.navigate(['/login']); // Redirect back to login if failed
      }
    });
  }
}
