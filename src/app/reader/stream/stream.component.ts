import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-stream',
  template: `<div style="height: 90vh;">
  <iframe [src]="safeSignedUrl" width="100%" height="100%"></iframe>
</div>`,
  imports: [CommonModule],
})
export class StreamComponent implements OnInit {

  safeSignedUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encodedUrl = params.get('url');
      if (encodedUrl) {
        const signedUrl = decodeURIComponent(encodedUrl);
        console.log('Decoded URL:', signedUrl);
        // Use DomSanitizer to mark the URL as safe
        this.safeSignedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(signedUrl);
      }
    });
  }
}
