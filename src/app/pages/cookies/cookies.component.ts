import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class CookiesComponent implements OnInit {
  cookiePreferences = {
    analytics: true,
    preferences: true
  };

  constructor() { }

  ngOnInit(): void {
  }

  savePreferences() {
    localStorage.setItem('cookiePreferences', JSON.stringify(this.cookiePreferences));
    alert('Cookie preferences saved successfully!');
  }
}
