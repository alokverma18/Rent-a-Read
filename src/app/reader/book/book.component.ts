import { Component, Input, OnInit } from '@angular/core';
import { Book } from '../home/home.component';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  bookId: string | null = null;
  book: Book | null = null;

  constructor(
    private route: ActivatedRoute, 
    private bookService: BookService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id');
      if (this.bookId) {
        this.getBookDetails(this.bookId);
      }
    });
  }

  getBookDetails(id: string): void {
    this.bookService.getBookById(id).subscribe(book => {
      this.book = book;
    });
  }

  async rentBook(book: any): Promise<void> {
    try {
      const result = await this.paymentService.createTransaction(book.price_per_hour, book._id);
      if (result.success) {
        this.bookService.rentBook(result.details).subscribe((res) => {
          this.snackBar.open('Book rented successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
        });
      }
    } catch (error) {
      console.error('Error during transaction:', error);
      this.snackBar.open('Error renting book. Please try again.', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }
  
}