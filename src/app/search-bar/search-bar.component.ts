import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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

  searchControl = new FormControl();
  filteredOptions!: Observable<any[]>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Auto-detect location on init
    this.detectLocation();

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string' && value.length > 2) {
          return this.apiService.searchCities(value).pipe(
            catchError(err => {
              console.error(err);
              return of([]);
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }

  displayFn(city: any): string {
    return city && city.name ? `${city.name}, ${city.country}` : '';
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const city = event.option.value;
    this.location = `${city.name}, ${city.country}`;
    this.searchControl.setValue(this.location, { emitEvent: false });
    this.search();
  }

  search() {
    // If search triggered manually (Enter/Button), value might be string in control
    const val = this.searchControl.value;
    if (typeof val === 'string') {
      this.location = val;
    } else if (val && val.name) {
      this.location = `${val.name}, ${val.country}`;
    }

    if (this.location && this.location.trim()) {
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
          this.location = "London";
          this.searchControl.setValue(this.location);
          this.search();
        },
        (error) => {
          console.log('Geolocation not available, using default');
          this.location = "London";
          this.searchControl.setValue(this.location);
          this.search();
        }
      );
    } else {
      this.location = "London";
      this.searchControl.setValue(this.location);
      this.search();
    }
  }
}
