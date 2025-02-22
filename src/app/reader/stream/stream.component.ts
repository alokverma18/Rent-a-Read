import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css'],
  imports: [CommonModule],
})
export class StreamComponent implements OnInit {
  safeSignedUrl: SafeResourceUrl | null = null;
  extractedText: string = 'Sample text for testing';
  isReading: boolean = false;
  synth = window.speechSynthesis;
  utterance = new SpeechSynthesisUtterance();

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encodedUrl = params.get('url');
      if (encodedUrl) {
        const signedUrl = decodeURIComponent(encodedUrl);
        this.safeSignedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(signedUrl);
        this.loadPdfText(signedUrl);
      }
    });

    this.utterance.onend = () => {
      this.isReading = false;
    };
  }

  // Load and extract text from the PDF using pdfjs-dist
  async loadPdfText(pdfUrl: string) {
    try {
      this.http.post<any>('http://localhost:5000/rentals/extract', { url: pdfUrl }).subscribe(
        response => {
          this.extractedText = response.text;
        },
        error => {
          console.error('Error fetching PDF text:', error);
        }
      );
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    }
  }

  // Start reading aloud
  startReading() {
    if (!this.extractedText) {
      alert('No readable text found in this book');
      return;
    }
    this.isReading = true;
    this.utterance.text = this.extractedText;
    this.utterance.rate = 1;
    this.utterance.pitch = 1;
    this.utterance.voice = this.synth.getVoices().find(voice => voice.lang === 'en-US') || null;
    this.synth.speak(this.utterance);
  }

  pauseReading() {
    this.synth.pause();
  }

  resumeReading() {
    this.synth.resume();
  }

  stopReading() {
    this.synth.cancel();
    this.isReading = false;
  }
}
