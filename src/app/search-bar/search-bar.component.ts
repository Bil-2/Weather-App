import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  location: string = "";
  isLoading: boolean = false;
  errorMessage: string = "";
  @Output() weatherDataEvent = new EventEmitter<any>();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Auto-detect location on init
    this.detectLocation();
  }

  search() {
    if (this.location.trim()) {
      this.isLoading = true;
      this.errorMessage = "";

      this.apiService.fetchData(this.location).subscribe({
        next: (res) => {
          this.weatherDataEvent.emit(res);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Search error:', err);
          this.errorMessage = err.message || 'Failed to fetch weather data. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          console.log("Weather search completed");
        }
      });
    } else {
      this.errorMessage = "Please enter a city name";
    }
  }

  detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use reverse geocoding or default to a major city
          // For now, defaulting to user's approximate location
          this.location = "London"; // You can enhance this with reverse geocoding
          this.search();
        },
        (error) => {
          console.log('Geolocation not available, using default');
          this.location = "London";
          this.search();
        }
      );
    } else {
      this.location = "London";
      this.search();
    }
  }
}
