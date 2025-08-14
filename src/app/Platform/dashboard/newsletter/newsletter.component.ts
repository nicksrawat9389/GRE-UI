import { Component, inject } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

interface Newsletter {
  title: string;
  pdfNAme: string;
  pdfBase64: string;
  safePdfUrl?: SafeResourceUrl; // for sanitized PDF URL
}
@Component({
  selector: 'app-newsletter',
  imports: [CommonModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
 private dashboardService = inject(DashboardService);
  private toasterService = inject(ToastrService);
  private sanitizer = inject(DomSanitizer);

  newsletters: Newsletter[] = [];
currentIndex: number = 0;
  ngOnInit(): void {
    this.getNewsletters();
  }

  getNewsletters(): void {
    this.dashboardService.getNewLetters().subscribe({
      next: (response: any) => {
        if (response && response.statusCode === 200) {
          this.newsletters = response.data.map((n: any) => ({
            ...n,
            safePdfUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
              'data:application/pdf;base64,' + n.pdfBase64
            )
          }));
        } else {
          this.toasterService.error(response.message || 'Failed to fetch newsletters');
        }
      },
      error: () => {
        this.toasterService.error('An error occurred while fetching newsletters.');
      }
    });
  }
  nextNewsletter(): void {
    if (this.currentIndex < this.newsletters.length - 1) {
      this.currentIndex++;
    }
  }

  prevNewsletter(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  
}