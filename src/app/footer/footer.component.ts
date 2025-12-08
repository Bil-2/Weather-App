import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  newsletterEmail: string = '';
  isSubmitting: boolean = false;
  submitMessage: string = '';
  submitSuccess: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onNewsletterSubmit(event: Event) {
    event.preventDefault();

    if (!this.newsletterEmail || !this.isValidEmail(this.newsletterEmail)) {
      this.submitMessage = 'Please enter a valid email address';
      this.submitSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';

    // Netlify Forms submission
    const formData = new FormData();
    formData.append('form-name', 'newsletter');
    formData.append('email', this.newsletterEmail);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString()
    })
      .then(() => {
        this.submitMessage = '🎉 Success! Check your inbox for weather updates.';
        this.submitSuccess = true;
        this.newsletterEmail = '';
        this.isSubmitting = false;

        // Clear message after 5 seconds
        setTimeout(() => {
          this.submitMessage = '';
        }, 5000);
      })
      .catch((error) => {
        console.error('Newsletter subscription error:', error);
        this.submitMessage = '❌ Oops! Something went wrong. Please try again.';
        this.submitSuccess = false;
        this.isSubmitting = false;
      });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  openGitHub() {
    window.open('https://github.com/Bil-2');
  }
}
