import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../owner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rentals',
  standalone: true,
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css'],
  imports: [CommonModule]
})
export class RentalsComponent implements OnInit {
  rentals: any[] = [];

  constructor(private ownerService: OwnerService) {}

  ngOnInit(): void {
    this.fetchRentals();
  }

  fetchRentals() {
    this.ownerService.getRentalsByOwner().subscribe(
      (data: any) => {
        this.rentals = data;
      },
      (error) => {
        console.error('Error fetching rentals:', error);
      }
    );
  }

  markAsReturned(rentalId: string) {
    // Handle book return logic here
  }

  extendRental(rentalId: string) {
    // Handle rental extension logic here
  }
}
