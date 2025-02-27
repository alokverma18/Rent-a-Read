import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

interface Rental {
  _id: string;
  book_id: string;
  user_id: string;
  start_date: Date;
  end_date: Date;
  status: string;
  amount: number;
  book_details?: {
    title: string;
    author: string;
    cover_image: string;
    file_url?: string;
  };
}

@Component({
  selector: 'app-rentals',
  standalone: true,
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css'],
  imports: [CommonModule],
})
export class ReaderRentalsComponent implements OnInit {
  rentals: Rental[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.getRentals();
  }

  getRentals(): void {
    this.isLoading = true;
    this.error = null;

    this.bookService.getRentals()
      .pipe(
        catchError(error => {
          this.error = 'Failed to load rentals. Please try again later.';
          console.error('Error fetching rentals:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.rentals = data;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  streamBook(url: string): void {
    if (!url) {
      console.error('Book URL is missing');
      return;
    }
    
    const encodedUrl = encodeURIComponent(url);
    this.router.navigate(['reader/stream', encodedUrl]);
  }
}
