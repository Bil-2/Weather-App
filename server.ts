import express, { Request, Response } from 'express';
import * as bodyParser from 'body-parser';

// We require the JS function as it is not a TS module
const weatherFunction = require('./netlify/functions/weather');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(bodyParser.json());
app.use(bodyParser.text());

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

// Mock Netlify Forms submission
const formHandler = (req: Request, res: Response) => {
  console.log('Form submitted:', req.body);
  // Netlify usually redirects to a success page or returns 200 for AJAX
  res.status(200).send('Form submission received');
};

app.post('/', formHandler);
app.post('/index.html', formHandler);

app.all('/.netlify/functions/weather', async (req: Request, res: Response) => {
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
