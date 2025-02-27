import { Component, OnInit } from '@angular/core';
import { OwnerService, Book } from '../owner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, BookFormComponent],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  isModalOpen = false;
  selectedBook: Book | null = null;

  constructor(private ownerService: OwnerService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.ownerService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  openAddBookModal() {
    this.selectedBook = null;
    this.isModalOpen = true;
  }

  openEditBookModal(book: Book) {
    this.selectedBook = { ...book };
    if (book.published_date) {
      this.selectedBook.published_date = new Date(book.published_date).toISOString().split('T')[0];
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.loadBooks();
  }

  deleteBook(bookId: string) {
    this.ownerService.deleteBook(bookId).subscribe({
      next: () => {
        this.loadBooks();
      },
      error: (error) => {
        console.error('Error deleting book:', error);
      }
    });
  }
}