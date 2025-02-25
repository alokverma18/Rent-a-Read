import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-github-auth-callback',
  template: `<p>Processing GitHub Login...</p>`
})
export class GithubAuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const refreshToken = params['refresh_token'];
      const role = params['role'];
      if (accessToken) {
        this.authService.githubLogin(JSON.stringify({ access_token: accessToken, refresh_token: refreshToken, role: role }));
        this.router.navigate(['/reader']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
