import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastComponent implements OnInit {
  forecastDays = [
    { name: 'Monday', icon: 'fas fa-sun', high: 75, low: 58, condition: 'Sunny', precipitation: 10, wind: 12 },
    { name: 'Tuesday', icon: 'fas fa-cloud-sun', high: 72, low: 56, condition: 'Partly Cloudy', precipitation: 20, wind: 10 },
    { name: 'Wednesday', icon: 'fas fa-cloud-rain', high: 68, low: 54, condition: 'Rainy', precipitation: 80, wind: 15 },
    { name: 'Thursday', icon: 'fas fa-cloud-bolt', high: 65, low: 52, condition: 'Thunderstorms', precipitation: 90, wind: 20 },
    { name: 'Friday', icon: 'fas fa-cloud-sun', high: 70, low: 55, condition: 'Mostly Sunny', precipitation: 15, wind: 8 },
    { name: 'Saturday', icon: 'fas fa-cloud', high: 73, low: 57, condition: 'Cloudy', precipitation: 30, wind: 11 },
    { name: 'Sunday', icon: 'fas fa-sun', high: 78, low: 60, condition: 'Clear', precipitation: 5, wind: 9 }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
