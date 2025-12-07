import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weatherData: any;

  constructor() { }

  ngOnInit(): void {
  }

  receiveWeatherData(data: any) {
    this.weatherData = data;
  }
}
