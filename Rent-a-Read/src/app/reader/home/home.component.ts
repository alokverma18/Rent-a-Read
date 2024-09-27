import { Component, NgModule, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  published_date: Date;
  price_per_hour: number;
  owner_id: string;
  created_at: Date;
  description: string;
  cover_image_url: string;
  genres: string[];
  availability: boolean;
}

@Component({
  standalone: true,
  selector: 'reader-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FormsModule, CommonModule],
})

export class HomeComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  sortBy: keyof Book = 'title'; // Use keyof Book for type safety
  sortOrder: string = 'asc';
  filters: { title?: string; author?: string; genre?: string } = {
    title: '',
    author: '',
    genre: '',
  };

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe((data: Book[]) => {
      this.books = data;
      this.applyFilters(); // Initial filter application
    });
  }

  onSortByChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortBy = selectElement.value as keyof Book; // Type assertion
    this.sortBooks();
  }

  onSortOrderChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOrder = selectElement.value;
    this.sortBooks();
  }

  onFilterChange() {
    this.applyFilters(); // Apply filters whenever input changes
  }

  sortBooks() {
    this.filteredBooks.sort((a, b) => {
      const aValue = a[this.sortBy]; // Accessing dynamically
      const bValue = b[this.sortBy]; // Accessing dynamically

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  applyFilters() {
    this.filteredBooks = this.books.filter((book) => {
      return (
        (!this.filters.title || book.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
        (!this.filters.author || book.author.toLowerCase().includes(this.filters.author.toLowerCase())) &&
        (!this.filters.genre || book.genres.includes(this.filters.genre))
      );
    });
    this.sortBooks(); // Re-sort after filtering
  }

  rentBook(bookId: string) {
    // Implement the rental logic here, e.g., call a service to rent the book
    console.log(`Renting book with ID: ${bookId}`);
  }

  getUniqueGenres() {
    const allGenres = this.books.flatMap(book => book.genres);
    return Array.from(new Set(allGenres)); 
  }


  openBook(book: Book) {
    console.log('Opening book:', book);
    this.router.navigate(['/book', book._id]);
  }
}