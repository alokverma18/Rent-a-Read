import { Component } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [],
  template:  `
  <h1>Access Denied</h1>
  <p>You do not have permission to access this page.</p>
`,
  styleUrl: './forbidden.component.css'
})
export class ForbiddenComponent {

}
