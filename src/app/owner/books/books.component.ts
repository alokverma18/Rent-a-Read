import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../owner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, BookFormComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  isModalOpen = false;
  selectedBook: any = null;

  constructor(private ownerService: OwnerService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.ownerService.getBooks().subscribe(data => {
      this.books = data;
      console.log('Books:', this.books);
    });
  }

  openAddBookModal() {
    this.selectedBook = null;
    this.isModalOpen = true;
  }

  openEditBookModal(book: any) {
    this.selectedBook = book;
    this.selectedBook.published_date = new Date(book.published_date).toISOString().split('T')[0];
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.loadBooks();
  }

  deleteBook(bookId: string) {
    this.ownerService.deleteBook(bookId).subscribe(() => {
      this.loadBooks();
    });
  }
}