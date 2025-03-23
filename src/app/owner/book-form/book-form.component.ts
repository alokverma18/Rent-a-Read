import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OwnerService } from '../owner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BookFormComponent implements OnInit {
  @Input() book: any;
  @Output() close = new EventEmitter<void>();

  bookData = {
    title: '',
    author: '',
    isbn: '',
    published_date: '',
    price_per_hour: 0,
    cover_image_url: '',
    genres: '',
    description: '',
    availability: 'Available'
  };
  
  file: File | null = null; 

  constructor(
    private ownerService: OwnerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.book) {
      this.bookData = { ...this.book, genres: this.book.genres.join(', ') };
    }
  }

  uploading = false;

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;

      this.ownerService.uploadCoverImage(file).subscribe(
        (response: any) => {
          this.bookData.cover_image_url = response.url;
          this.uploading = false;
        },
        (error) => {
          console.error('Error uploading cover image:', error);
          this.uploading = false;
        }
      );
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.file = target.files[0];
    }
  }

  onSubmit() {
    const bookPayload = {
      ...this.bookData,
      genres: this.bookData.genres.split(',').map((genre: string) => genre.trim())
    };

    const formData = new FormData();
    formData.append('title', bookPayload.title);
    formData.append('author', bookPayload.author);
    formData.append('isbn', bookPayload.isbn);
    formData.append('published_date', bookPayload.published_date);
    formData.append('price_per_hour', bookPayload.price_per_hour.toString());
    formData.append('cover_image_url', bookPayload.cover_image_url);
    formData.append('genres', bookPayload.genres.join(', '));
    formData.append('description', bookPayload.description);
    formData.append('availability', bookPayload.availability);

    if (this.file) {
      formData.append('file', this.file); 
    }

    if (this.book) {
      formData.set('published_date', new Date(bookPayload.published_date).toDateString());
      this.ownerService.updateBook(this.book._id, formData).subscribe(() => {
        this.snackBar.open('Book updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.closeForm();
      });
    } else {
      this.ownerService.addBook(formData).subscribe(() => {
        this.snackBar.open('Book added successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.closeForm();
      });
    }
  }

  closeForm() {
    this.close.emit();
  }
}
