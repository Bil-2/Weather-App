const axios = require('axios');

const cache = new Map();
const CACHE_TTL = 600000; // 10 minutes

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { q, lat, lon } = event.queryStringParameters || {};

    if (!q && (!lat || !lon)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Provide city (q) or coordinates (lat, lon)' })
      };
    }

    const cacheKey = (q || `${lat},${lon}`).toLowerCase();
    const now = Date.now();

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && (now - cached.timestamp < CACHE_TTL)) {
      console.log('Cache hit:', cacheKey);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ...cached.data, cached: true })
      };
    }

    // Call OpenWeatherMap API
    const params = new URLSearchParams({
      appid: process.env.OPENWEATHER_API_KEY || 'bd5e378503939ddaee76f12ad7a97608',
      units: 'metric'
    });

    if (q) params.append('q', q);
    else {
      params.append('lat', lat);
      params.append('lon', lon);
    }

    console.log('API call:', cacheKey);
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?${params.toString()}`);

    // Cache it
    cache.set(cacheKey, {
      data: response.data,
      timestamp: now
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...response.data, cached: false })
    };

  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: error.response?.data?.message || 'Failed to fetch weather'
      })
    };
  }
};
