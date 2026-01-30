import express from 'express';
import bodyParser from 'body-parser';
const cron = require('node-cron');
import axios from 'axios';
import sgMail from '@sendgrid/mail';

// Use strict typing for require to satisfy linters if @types/node is missing or misconfigured in editor
declare function require(name: string): any;

// We require the JS function as it is not a TS module
const weatherFunction = require('./netlify/functions/weather');

const app = express();
// Safely access process.env with type safety
const PORT = process.env['PORT'] || 9000;

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

// Interface for Netlify Event
interface NetlifyEvent {
  httpMethod: string;
  queryStringParameters: any;
  headers: any;
  body: string | null;
}

// Interface for Netlify Response
interface NetlifyResponse {
  statusCode: number;
  headers?: { [key: string]: string | number | boolean };
  body: string;
}

const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, 'subscriptions.json');

// Interface for Subscription
interface Subscription {
  email: string;
  city: string;
  date: string;
}

// Mock Netlify Forms submission with local persistence
const formHandler = (req: express.Request, res: express.Response) => {
  console.log('Form submitted:', req.body);

  const { email, city } = req.body;
  if (email && city) {
    const newSub: Subscription = { email, city, date: new Date().toISOString() };

    // Read existing
    let subs: Subscription[] = [];
    if (fs.existsSync(DB_FILE)) {
      try {
        subs = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      } catch (e) {
        console.error('Error reading db:', e);
      }
    }

    // Check if email already exists
    const existingIndex = subs.findIndex(s => s.email === email);

    if (existingIndex > -1) {
      // Update existing
      subs[existingIndex].city = city;
      subs[existingIndex].date = new Date().toISOString();
      console.log(`Updated city for ${email} to ${city}`);
    } else {
      // Add new
      subs.push(newSub);
      console.log(`Added new subscription for ${email}`);
    }

    // Save
    fs.writeFileSync(DB_FILE, JSON.stringify(subs, null, 2));
  }

  // Netlify usually redirects to a success page or returns 200 for AJAX
  res.status(200).send('Form submission received and saved to local DB');
};

app.post('/', formHandler);
app.post('/index.html', formHandler);

// Endpoint to view DB (for debugging)
app.get('/api/subscriptions', (req: express.Request, res: express.Response) => {
  if (fs.existsSync(DB_FILE)) {
    res.json(JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
  } else {
    res.json([]);
  }
});

// --- Scheduled Email Logic ---
const sendDailyEmails = async () => {
  console.log('Starting daily email routine...');
  const SENDGRID_API_KEY = process.env['SENDGRID_API_KEY'];
  if (!SENDGRID_API_KEY) {
    console.error('Missing SENDGRID_API_KEY');
    return;
  }
  sgMail.setApiKey(SENDGRID_API_KEY);
  const OPENWEATHER_API_KEY = process.env['OPENWEATHER_API_KEY'] || '24d300584f820ede6886da93fa566cd2';
  const FROM_EMAIL = process.env['SENDER_EMAIL'] || 'noreply@yourdomain.com';

  let subs: Subscription[] = [];
  if (fs.existsSync(DB_FILE)) {
    try {
      subs = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading db:', e);
      return;
    }
  }

  if (subs.length === 0) {
    console.log('No subscriptions found.');
    return;
  }

  // Remove duplicates
  const uniqueSubscribers = Array.from(new Map(subs.map(sub => [sub.email, sub])).values());
  console.log(`Processing ${uniqueSubscribers.length} unique subscribers...`);

  for (const sub of uniqueSubscribers) {
    try {
      // Fetch weather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${sub.city}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      const weather = weatherResponse.data;
      const temp = Math.round(weather.main.temp);
      const description = weather.weather[0].description;
      const icon = weather.weather[0].icon;

      // Realstack / Professional Email Template (No Emojis)
      const emailHTML = `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; background-color: #f4f4f4; color: #333;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                      <div style="background-color: #0056b3; padding: 20px; text-align: center; color: #ffffff;">
                          <h2 style="margin: 0; font-size: 24px;">Realstack Weather</h2>
                          <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.8;">${sub.city}, ${weather.sys.country}</p>
                      </div>
                      <div style="padding: 30px; text-align: center;">
                          <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather icon" style="width: 100px; height: 100px; margin-bottom: 10px;">
                          <h1 style="margin: 0; font-size: 48px; color: #333;">${temp}&deg;C</h1>
                          <p style="margin: 10px 0 20px; font-size: 18px; color: #666; text-transform: capitalize;">${description}</p>
                          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                          <div style="display: flex; justify-content: space-around; text-align: left;">
                              <div>
                                  <p style="margin: 5px 0; font-size: 12px; color: #999;">Humidity</p>
                                  <p style="margin: 0; font-weight: bold;">${weather.main.humidity}%</p>
                              </div>
                              <div>
                                  <p style="margin: 5px 0; font-size: 12px; color: #999;">Wind</p>
                                  <p style="margin: 0; font-weight: bold;">${weather.wind.speed} m/s</p>
                              </div>
                               <div>
                                  <p style="margin: 5px 0; font-size: 12px; color: #999;">Feels Like</p>
                                  <p style="margin: 0; font-weight: bold;">${Math.round(weather.main.feels_like)}&deg;C</p>
                              </div>
                          </div>
                      </div>
                      <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
                          <p style="margin: 0;">Stay prepared for the day.</p>
                      </div>
                  </div>
              </div>
           `;

      const msg = {
        to: sub.email,
        from: FROM_EMAIL,
        subject: `Daily Weather for ${sub.city}: ${temp}C`,
        html: emailHTML,
      };

      await sgMail.send(msg);
      console.log(`Sent email to ${sub.email}`);

    } catch (error: any) {
      console.error(`Failed processing ${sub.email}:`, error.message);
    }
  }
};

// Schedule for 6:00 AM Daily
cron.schedule('0 6 * * *', () => {
  sendDailyEmails();
}, {
  timezone: "Asia/Kolkata"
});

// Manual trigger for testing
app.post('/api/trigger-email', async (req: express.Request, res: express.Response) => {
  console.log('Manual email trigger received.');
  await sendDailyEmails();
  res.send('Email process triggered.');
});

app.all('/.netlify/functions/weather', async (req: express.Request, res: express.Response) => {
  const event: NetlifyEvent = {
    httpMethod: req.method,
    queryStringParameters: req.query,
    headers: req.headers,
    body: typeof req.body === 'object' ? JSON.stringify(req.body) : req.body,
  };

  const context = {}; // Mock context

  try {
    const result: NetlifyResponse = await weatherFunction.handler(event, context);

    // Set headers
    if (result.headers) {
      Object.entries(result.headers).forEach(([key, value]) => {
        res.setHeader(key, String(value));
      });
    }

    res.status(result.statusCode).send(result.body);
  } catch (error) {
    console.error('Error invoking function:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Backend wrapper running on port ${PORT} (TypeScript)`);
});
