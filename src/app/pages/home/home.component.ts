import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weatherData: any;
  subscriptionEmail: string = '';
  subscriptionCity: string = '';
  isSubmitting: boolean = false;
  subscriptionMessage: string = '';
  subscriptionSuccess: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  receiveWeatherData(data: any) {
    this.weatherData = data;
  }

  onSubscribe(event: Event) {
    event.preventDefault();
    
    if (!this.subscriptionEmail || !this.subscriptionCity) {
      this.subscriptionMessage = '❌ Please fill in both email and city';
      this.subscriptionSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.subscriptionMessage = '';

    const formData = new FormData();
    formData.append('form-name', 'newsletter');
    formData.append('email', this.subscriptionEmail);
    formData.append('city', this.subscriptionCity);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString()
    })
    .then(() => {
      this.subscriptionMessage = '✅ Successfully subscribed! Check your email for confirmation.';
      this.subscriptionSuccess = true;
      this.subscriptionEmail = '';
      this.subscriptionCity = '';
      this.isSubmitting = false;
    })
    .catch((error) => {
      this.subscriptionMessage = '❌ Subscription failed. Please try again.';
      this.subscriptionSuccess = false;
      this.isSubmitting = false;
    });
  }
}
