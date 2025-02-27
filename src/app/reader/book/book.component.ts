import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../payment.service';
import { Book } from '../../owner/owner.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  bookId: string | null = null;
  book: Book | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private bookService: BookService,
    private paymentService: PaymentService
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
    this.isLoading = true;
    this.errorMessage = null;
    
    this.bookService.getBookById(id)
      .pipe(
        catchError(error => {
          this.errorMessage = `Failed to load book details: ${error.message}`;
          console.error('Error loading book details:', error);
          return of(null);
        })
      )
      .subscribe({
        next: book => {
          this.book = book;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  async rentBook(book: Book): Promise<void> {
    try {
      const result = await this.paymentService.createTransaction(book.price_per_hour, book._id);
      if (result.success) {
        this.bookService.rentBook(result.details).subscribe({
          next: () => {
            alert('Book rented successfully!');
          },
          error: (error) => {
            console.error('Error recording rental:', error);
            alert('Payment processed but failed to record rental. Please contact support.');
          }
        });
      }
    } catch (error) {
      console.error('Error during transaction:', error);
      alert('Failed to rent book.');
    }
  }
}