import { Component, Input, OnInit } from '@angular/core';
import { Book } from '../home/home.component';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../payment.service';

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
    this.bookService.getBookById(id).subscribe(book => {
      this.book = book;
    });
  }

  async rentBook(book: any): Promise<void> {
    try {
      const result = await this.paymentService.createTransaction(book.price_per_hour, book._id);
      
      if (result.success) {
        this.bookService.rentBook(result.order).subscribe(() => {
          this.getBookDetails(book._id);
        });
        alert('Book rented successfully!');
      }
    } catch (error) {
      console.error('Error during transaction:', error);
      alert('Failed to rent book.');
    }
  }
  
}