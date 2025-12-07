# 🌤️ WeatherApp - Modern Angular Weather Application

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://weather-app-biltu.netlify.app)
[![Angular](https://img.shields.io/badge/Angular-14-red?logo=angular)](https://angular.io/)
[![PWA](https://img.shields.io/badge/PWA-enabled-blue)](https://web.dev/progressive-web-apps/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?logo=netlify)](https://netlify.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, responsive weather application built with Angular 14 that provides real-time weather information, 7-day forecasts, and interactive weather maps. Fully optimized PWA support for offline access.

## ✨ Features

### Core Features
- 🔍 **Smart Search** - Search weather by city name with auto-location detection
- 🌡️ **Real-time Data** - Current temperature, humidity, wind speed, and conditions
- 📅 **7-Day Forecast** - Extended weather predictions with detailed information
- 🗺️ **Weather Maps** - Interactive temperature, precipitation, wind, and cloud maps
- ⚠️ **Weather Alerts** - Severe weather notifications and warnings
- 🌓 **Dark/Light Theme** - Toggle between themes for comfortable viewing
- 📱 **PWA Support** - Install as app, works offline
- 🚀 **Auto-Location** - Automatically detects user location on first load
- ⚡ **Performance Optimized** - OnPush change detection, lazy loading ready
- 🔒 **Secure Backend** - Netlify Functions proxy for API security & rate limiting

### Additional Pages
- 📰 **Weather Blog** - Tips, insights, and weather news
- 📚 **Help Center** - FAQ and support
- 📧 **Contact** - Get in touch
- ℹ️ **About** - App information and technology stack
- 🔐 **Legal Pages** - Privacy Policy, Terms of Service, Cookie Settings

## 🚀 Live Demo

**Live URL:** [https://weather-app-biltu.netlify.app](https://weather-app-biltu.netlify.app)

> **Note:** Powered by Netlify Functions (Serverless Backend) to securely handle API requests and caching.

## 🛠️ Technology Stack

### Frontend
- **Framework:** Angular 14
- **Language:** TypeScript 4.7
- **Styling:** CSS3, Bootstrap 5, Angular Material 13
- **Icons:** FontAwesome 6
- **PWA:** @angular/service-worker
- **HTTP Client:** RxJS 7.5

### Backend (Serverless)
- **Platform:** Netlify Functions (Node.js)
- **Caching:** In-memory caching (10 min)
- **API:** OpenWeatherMap API

### Deployment
- **Hosting:** Netlify
- **CDN:** Netlify Edge
- **SSL:** Automatic HTTPS

## 💻 Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Bil-2/Weather-App.git
   cd Weather-App
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   Open `http://localhost:4200/`. (Uses Netlify Proxy for API calls).

## 🌐 Deployment

This project is configured for **Netlify**.

1. Connect Repository to Netlify.
2. Build Command: `ng build --configuration production`
3. Publish Directory: `dist/weather-app`
4. Functions Directory: `netlify/functions`

## 📱 PWA Features

- **Installable:** Add to Home Screen on iOS/Android/Desktop
- **Offline Mode:** View previously fetched weather data without internet
- **App-like Experience:** Fullscreen, no browser bars

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Biltu Bag**
- 💼 LinkedIn: [Biltu Bag](https://www.linkedin.com/in/biltu-bag-01b5172a7)
- 🐙 GitHub: [@biltubag](https://github.com/biltubag)
- 🐦 Twitter: [@bag_biltu](https://x.com/bag_biltu)
- 📧 Email: biltubag29@gmail.com

---

<div align="center">

**If you like this project, don't forget to ⭐ star the repository!**

Made with ❤️ by [Biltu Bag](https://github.com/biltubag)

</div>
