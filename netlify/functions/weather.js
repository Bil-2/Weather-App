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
    const { q, lat, lon, type } = event.queryStringParameters || {};

    if (!q && (!lat || !lon)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Provide city (q) or coordinates (lat, lon)' })
      };
    }

    const cacheKey = (type === 'geo' ? `geo:${q}` : (q || `${lat},${lon}`)).toLowerCase();
    const now = Date.now();

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && (now - cached.timestamp < CACHE_TTL)) {
      console.log('Cache hit:', cacheKey);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cached.data) // data already object
      };
    }

    // Call OpenWeatherMap API
    const apiKey = process.env.OPENWEATHER_API_KEY || '24d300584f820ede6886da93fa566cd2';
    let url;
    let responseData;

    if (type === 'geo') {
      // Request more results to prioritize Indian cities
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=30&appid=${apiKey}`;
    } else {
      const params = new URLSearchParams({
        appid: apiKey,
        units: 'metric'
      });
      if (q) params.append('q', q);
      else {
        params.append('lat', lat);
        params.append('lon', lon);
      }
      url = `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`;
    }

    console.log('API call:', cacheKey);
    const response = await axios.get(url);

    // Sort geocoding results to prioritize Indian cities
    if (type === 'geo' && Array.isArray(response.data)) {
      const sortedResults = response.data.sort((a, b) => {
        // Indian cities (IN) come first
        if (a.country === 'IN' && b.country !== 'IN') return -1;
        if (a.country !== 'IN' && b.country === 'IN') return 1;
        return 0; // Keep original order for same country
      });
      // Return top 10 after sorting
      responseData = sortedResults.slice(0, 10);
    } else {
      responseData = response.data;
    }

    // Cache it
    cache.set(cacheKey, {
      data: responseData,
      timestamp: now
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
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
