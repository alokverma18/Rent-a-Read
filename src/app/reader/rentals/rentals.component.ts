import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rentals',
  standalone: true,
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css'],
  imports: [CommonModule],
})
export class ReaderRentalsComponent implements OnInit {
  rentals: any[] = [];

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.getRentals();
  }

  getRentals(): void {
    this.bookService.getRentals().subscribe((data) => {
      this.rentals = data;
    });
  }

  streamBook(url: string): void {
    const encodedUrl = encodeURIComponent(url);
    this.router.navigate(['reader/stream', encodedUrl]);
  }
}
