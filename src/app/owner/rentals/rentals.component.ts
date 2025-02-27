import { Component, OnInit } from '@angular/core';
import { OwnerService, Rental } from '../owner.service';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-rentals',
  standalone: true,
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css'],
  imports: [CommonModule]
})
export class RentalsComponent implements OnInit {
  rentals: Rental[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private ownerService: OwnerService) {}

  ngOnInit(): void {
    this.fetchRentals();
  }

  fetchRentals() {
    this.isLoading = true;
    this.error = null;

    this.ownerService.getRentalsByOwner()
      .pipe(
        catchError(error => {
          this.error = 'Failed to load rentals. Please try again later.';
          console.error('Error fetching rentals:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (data: Rental[]) => {
          this.rentals = data;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  markAsReturned(rentalId: string) {
    // Implementation for marking a rental as returned
    // This would typically call an API endpoint
    console.log(`Mark rental ${rentalId} as returned`);
  }

  extendRental(rentalId: string) {
    // Implementation for extending a rental
    // This would typically call an API endpoint
    console.log(`Extend rental ${rentalId}`);
  }
}
