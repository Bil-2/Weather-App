// Daily Weather Email Function - Netlify Scheduled Function
// Runs every day at 6:00 AM IST (12:30 AM UTC)
// Schedule: 30 0 * * * (cron format)

const axios = require('axios');

exports.handler = async (event) => {
  console.log('🌅 Daily Weather Email Function Starting...');
  console.log('Event type:', event.httpMethod || 'scheduled');

  try {
    // Step 1: Fetch all newsletter subscribers from Netlify Forms API
    const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;
    const SITE_ID = process.env.NETLIFY_SITE_ID;

    if (!NETLIFY_API_TOKEN || !SITE_ID) {
      console.error('❌ Missing environment variables');
      console.error('NETLIFY_API_TOKEN:', NETLIFY_API_TOKEN ? 'Set' : 'Missing');
      console.error('SITE_ID:', SITE_ID ? 'Set' : 'Missing');
      throw new Error('Missing Netlify API credentials. Please set NETLIFY_API_TOKEN and NETLIFY_SITE_ID in environment variables.');
    }

    console.log('✅ Fetching form submissions...');

    // Get form submissions
    const formsResponse = await axios.get(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`
        }
      }
    );

    console.log(`📋 Total submissions received: ${formsResponse.data.length}`);

    const subscribers = formsResponse.data
      .filter(sub => sub.form_name === 'newsletter' && sub.data && sub.data.email && sub.data.city)
      .map(sub => ({
        email: sub.data.email,
        city: sub.data.city,
        timestamp: sub.created_at
      }));

    // Remove duplicates (keep latest subscription per email)
    const uniqueSubscribers = Array.from(
      new Map(subscribers.map(sub => [sub.email, sub])).values()
    );

    console.log(`📧 Found ${uniqueSubscribers.length} unique subscribers`);

    if (uniqueSubscribers.length === 0) {
      console.log('⚠️ No subscribers found');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No subscribers found' })
      };
    }

    // Step 2: Send weather emails using SendGrid
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.SENDER_EMAIL || 'noreply@yourdomain.com';

    if (!SENDGRID_API_KEY) {
      console.error('❌ Missing SENDGRID_API_KEY');
      throw new Error('Missing SendGrid API key. Please set SENDGRID_API_KEY in environment variables.');
    }

    console.log('✅ SendGrid configured');

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(SENDGRID_API_KEY);

    // Step 3: Fetch weather for each subscriber and send email
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '24d300584f820ede6886da93fa566cd2';

    console.log('📤 Starting to send emails...');

    const emailPromises = uniqueSubscribers.map(async (subscriber) => {
      try {
        // Fetch weather data
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${subscriber.city}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );

        const weather = weatherResponse.data;
        const temp = Math.round(weather.main.temp);
        const feelsLike = Math.round(weather.main.feels_like);
        const description = weather.weather[0].description;
        const icon = weather.weather[0].icon;
        const humidity = weather.main.humidity;
        const windSpeed = weather.wind.speed;

        // Create email HTML
        const emailHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center; color: white; }
              .header h1 { margin: 0; font-size: 28px; }
              .header p { margin: 10px 0 0; opacity: 0.9; }
              .weather-icon { font-size: 80px; margin: 20px 0; }
              .content { padding: 30px; }
              .temp { font-size: 48px; font-weight: bold; color: #1f2937; text-align: center; margin: 20px 0; }
              .description { text-align: center; font-size: 18px; color: #6b7280; margin-bottom: 30px; text-transform: capitalize; }
              .details { background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-row:last-child { border-bottom: none; }
              .detail-label { color: #6b7280; }
              .detail-value { color: #1f2937; font-weight: 600; }
              .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 14px; }
              .unsubscribe { color: #3b82f6; text-decoration: none; }
              @media (max-width: 600px) {
                .temp { font-size: 36px; }
                .header h1 { font-size: 24px; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>☀️ Your Daily Weather Report</h1>
                <p>${subscriber.city}, ${weather.sys.country}</p>
              </div>
              <div class="content">
                <div class="weather-icon">
                  <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}" style="width: 120px; height: 120px;">
                </div>
                <div class="temp">${temp}°C</div>
                <div class="description">${description}</div>
                
                <div class="details">
                  <div class="detail-row">
                    <span class="detail-label">Feels Like</span>
                    <span class="detail-value">${feelsLike}°C</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${humidity}%</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Wind Speed</span>
                    <span class="detail-value">${windSpeed} m/s</span>
                  </div>
                </div>

                <p style="text-align: center; color: #6b7280; margin: 30px 0;">
                  Have a great day! Stay weather-ready. 🌤️
                </p>
              </div>
              <div class="footer">
                <p>You're receiving this because you subscribed to daily weather updates.</p>
                <p><a href="#" class="unsubscribe">Unsubscribe</a> | <a href="https://weather-app-biltu.netlify.app" class="unsubscribe">View Forecast</a></p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Send email via SendGrid
        const msg = {
          to: subscriber.email,
          from: FROM_EMAIL,
          subject: `☀️ Daily Weather: ${temp}°C in ${subscriber.city}`,
          html: emailHTML
        };

        await sgMail.send(msg);
        console.log(`✅ Sent email to ${subscriber.email} for ${subscriber.city}`);

        return { success: true, email: subscriber.email };
      } catch (error) {
        console.error(`❌ Failed to send email to ${subscriber.email}:`, error.message);
        return { success: false, email: subscriber.email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`📊 Email sending complete: ${successful} successful, ${failed} failed`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Daily weather emails sent',
        total: uniqueSubscribers.length,
        successful,
        failed,
        timestamp: new Date().toISOString(),
        results
      })
    };

  } catch (error) {
    console.error('❌ Error in daily email function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
