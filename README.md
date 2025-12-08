# 🌦️ Weather Web App

A premium, feature-rich weather application built with **Angular 14** and **Netlify Serverless Functions**. Delivers real-time weather updates, forecasts, and automated email reports with a beautiful, responsive UI.

[**🚀 Live Demo**](https://weather-app-biltu.netlify.app)

---

## ✨ Key Features

### 🌍 **Smart Weather Search**
- **City Autocomplete**: Type "KOL" → Suggestions like "Kolkata, IN".
- **Indian City Priority**: Intelligent sorting always prioritizes Indian cities (e.g., Mumbai, Delhi, Bangalore) at the top of results.
- **Auto-Location**: Automatically detects user location on startup.

### 📧 **Daily Weather Emails (New!)**
- **Automated Reports**: Subscribers receive a beautiful HTML weather report every morning at **6:00 AM IST**.
- **Smart Subscription Form**: Collects City + Email securely via Netlify Forms.
- **100% Free**: Built using Netlify Scheduled Functions & SendGrid Free Tier (100 emails/day).

### 🎨 **Premium UI/UX**
- **Glassmorphism Design**: Modern, translucent visuals with dynamic backgrounds.
- **Global Dark Mode**: Fully supported "Deep Dark" theme across ALL pages.
- **Responsive**: Perfect on Mobile, Tablet, and Desktop.
- **PWA Ready**: Installable as a native app on iOS and Android.

### 📊 **Comprehensive Data**
- **Current Weather**: Temp, Humidity, Wind, Visibility, Pressure.
- **5-Day Forecast**: Detailed 3-hour interval predictions.
- **Visual Maps**: Temperature, Wind, and Pressure heatmaps.

---

## 🛠️ Tech Stack

- **Frontend**: Angular 14, RxJS, TypeScript
- **Styling**: CSS Variables (Theming), Angular Material, Bootstrap Icons
- **Backend**: Netlify Functions (Node.js Serverless)
- **Database**: Netlify Forms (Subscriber storage)
- **Email Service**: SendGrid API
- **APIs**: OpenWeatherMap (Weather & Geocoding)
- **Hosting**: Netlify (CI/CD)

---

## 🚀 Local Setup Guide

### 1. Clone & Install
```bash
git clone https://github.com/Bil-2/Weather-App.git
cd Weather-App
npm install
```

### 2. Configure Environment
Create a `.env` file (or set system variables) if running functions locally:
```env
OPENWEATHER_API_KEY=your_key_here
SENDGRID_API_KEY=your_sendgrid_key
SENDER_EMAIL=your_verified_sender_email
NETLIFY_API_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

### 3. Run Locally
```bash
# Run Angular frontend
ng serve

# Run with Netlify Dev (Front + Back)
netlify dev
```
Visit `http://localhost:4200`

---

## 📧 Daily Email Setup (100% Free)

To enable the daily 6:00 AM weather emails:

1. **SendGrid**: Create a free account & verify a sender identity. Get an API Key.
2. **Netlify**:
   - Go to **Site Settings > Environment Variables**.
   - Add keys: `SENDGRID_API_KEY`, `SENDER_EMAIL`, `NETLIFY_API_TOKEN`, `NETLIFY_SITE_ID`.
   - Add `OPENWEATHER_API_KEY`.
3. **Schedule**: The function `daily-weather-email` is pre-configured in `netlify.toml` to run at **30 0 * * *** (12:30 AM UTC = 6:00 AM IST).
   - Ensure you enable the scheduled function in Netlify Labs/Functions dashboard if needed.

---

## 📦 Deployment to Netlify

This project is optimized for Netlify.

### Option 1: Automatic (Recommended)
Connect your GitHub repository to Netlify. It will auto-detect settings.
- **Build Command**: `npm run vercel-build` (or `ng build --configuration production`)
- **Publish Directory**: `dist/weather-app`

### Option 2: Manual CLI
```bash
# Build
npm run vercel-build

# Deploy
npx netlify deploy --prod --dir dist/weather-app --functions netlify/functions
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── pages/          # 13+ Route components (Home, About, Forecast...)
│   ├── search-bar/     # Autocomplete search component
│   ├── footer/         # Newsletter subscription form
│   ├── services/       # ApiService, ThemeService
│   └── ...
├── assets/             # Images & Icons
└── styles.css          # Global variables & Dark/Light themes

netlify/
└── functions/
    ├── weather.js              # Proxy for Weather/Geo APIs
    └── daily-weather-email.js  # Scheduled cron job for emails
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

### Created by [Biltu Bag](https://github.com/Bil-2) | © 2025
