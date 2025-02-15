import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { OwnerService } from '../owner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'owner-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class OwnerHomeComponent implements OnInit {
  stats: any;
  recentRentals: any[] = [];

  constructor(private ownerService: OwnerService, private router: Router) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentRentals();
  }

  loadStats() {
    this.ownerService.getStats().subscribe(data => {
      this.stats = data;
    });
  }

  loadRecentRentals() {
    this.ownerService.getRecentRentals().subscribe(data => {
      this.recentRentals = data;
    });
  }

  navigateToBooks() {
    this.router.navigate(['/owner/books']);
  }

  navigateToRentals() {
    this.router.navigate(['/owner/rentals']);
  }
  
}