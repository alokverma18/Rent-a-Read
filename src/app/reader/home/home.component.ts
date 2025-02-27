import { Component, effect, NgModule, OnInit, signal, computed } from '@angular/core';
import { BookService } from '../book.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpeechService, SpeechToTextResponse } from './speech.service';
import { RecommendationsService } from './recommendations.service';
import { catchError, of } from 'rxjs';
import { Book } from '../../owner/owner.service';

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
  sortBy: keyof Book = 'title'; 
  sortOrder: string = 'asc';
  isRecording: boolean = false;
  audioChunks: Blob[] = [];
  mediaRecorder!: MediaRecorder;
  recommendedBooks: Book[] = [];

  filters = {
    search: signal(''),
    title: signal(''),
    author: signal(''),
    genre: signal('')
  };

  constructor(
    private bookService: BookService, 
    private router: Router,
    private speechService: SpeechService,
    private recommendationService: RecommendationsService
  ) {
    effect(() => {
      this.applyFilters();
    });
  }

  ngOnInit() {
    this.loadBooks();
    this.fetchRecommendations();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  onSortByChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortBy = selectElement.value as keyof Book; 
    this.sortBooks();
  }

  onSortOrderChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOrder = selectElement.value;
    this.sortBooks();
  }

  onFilterChange() {
    this.applyFilters(); 
  }

  sortBooks() {
    this.filteredBooks.sort((a, b) => {
      const aValue = a[this.sortBy]; 
      const bValue = b[this.sortBy]; 
      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  onSearchChange($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    this.filters.search.set(inputElement.value);
  }

  applyFilters() {
    const searchText = this.filters.search().toLowerCase();
  
    this.filteredBooks = this.books.filter((book) => {
      return (
        (!this.filters.search() || book.title.toLowerCase().includes(searchText) || 
          (book.description && book.description.toLowerCase().includes(searchText))) &&
        (!this.filters.title() || book.title.toLowerCase().includes(this.filters.title().toLowerCase())) &&
        (!this.filters.author() || book.author.toLowerCase().includes(this.filters.author().toLowerCase())) &&
        (!this.filters.genre() || book.genres.includes(this.filters.genre()))
      );
    });
    this.sortBooks();
  }

  rentBook(bookId: string) {
    // Implementation to be added if needed
  }

  getUniqueGenres() {
    const allGenres = this.books.flatMap(book => book.genres);
    return Array.from(new Set(allGenres)); 
  }

  openBook(book: Book) {
    this.router.navigate(['/book', book._id]);
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        if (audioBlob.size > 0) {
          this.sendAudioToBackend(audioBlob);
        } else {
          console.error("Error: Audio blob is empty.");
        }
      };

      this.audioChunks = [];
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  sendAudioToBackend(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
  
    this.speechService.convertSpeechToText(formData)
      .pipe(
        catchError(error => {
          console.error('Speech to text conversion error:', error);
          return of({ text: '' } as SpeechToTextResponse);
        })
      )
      .subscribe({
        next: (response) => {
          if (response.text) {
            this.filters.search.set(response.text);
            this.applyFilters();
          }
        }
      });
  }

  fetchRecommendations(): void {
    this.recommendationService.fetchRecommendations().subscribe({
      next: (data) => this.recommendedBooks = data,
      error: (err) => console.error("Failed to fetch recommendations", err)
    });
  }
}
