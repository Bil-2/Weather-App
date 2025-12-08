import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.weather';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private iconUrl = environment.iconUrl;
  private apiKey = environment.apiKey;

  public data: any;

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${city}`).pipe(
      tap((res: any) => this.data = res)
    );
  }

  fetchData(cityName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${cityName}&appid=${this.apiKey}`);
  }

  searchCities(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?type=geo&q=${query}&appid=${this.apiKey}`);
  }

  getWeatherIconUrl(iconCode: string): string {
    return `${this.iconUrl}${iconCode}@2x.png`;
  }
}
