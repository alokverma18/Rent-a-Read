import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rentals',
  standalone: true,
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.css'],
  imports: [CommonModule],
})
export class ReaderRentalsComponent implements OnInit {
  rentals: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.getRentals();
  }

  getRentals(): void {
    this.bookService.getRentals().subscribe((data) => {
      this.rentals = data;
    });
  }

  streamBook(url: string): void {
    window.open(url, '_blank');
  }
}
