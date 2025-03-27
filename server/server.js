const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const dotenv = require('dotenv');
const cors = require('cors');
const { Pool } = require('pg');
const winston = require('winston');
const DatabaseHelper = require('./utils/database-helper');
const GeoHelper = require('./utils/geo-helper');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Axios retry/debounce setup
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    logger.warn(`Request Retry attempt: ${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response?.status >= 500; // Only retry when the response is a 5xx server error, rather than 4xx client errors
  }
});

// Rate limit setup
const limiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 5,              // max requests per windowMs value
  message: 'Too many outgoing requests, please try again later'
});

app.use(limiter);


// Health/sanity check endpoint to ensure Client is still talking to Server
app.get('/api-health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'API is working!', time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).send('Database connection error');
  }
});

// Primary distance calculator endpoint, incl. geocoding

app.post('/distance', async (req, res) => {

  // Parse out addresses from req body
  const { address1, address2 } = req.body;

  try {
    // Geocode addresses here
    const address1_geocode = await GeoHelper.geocode(address1);
    const address2_geocode = await GeoHelper.geocode(address2);

      // Extract coordinates from OSM objects
      const { lat: lat1, lon: lon1 } = address1_geocode;
      const { lat: lat2, lon: lon2 } = address2_geocode;

    // Calculate distance between the 2 points
    // Using "Haversine formula" assuming straight line distance across a sphere
    const distance = GeoHelper.calculateHaversineDistance(lat1, lon1, lat2, lon2);

    // Store the query in the database for historical record
    // "distance_queries" table schema defined in migration file
    await DatabaseHelper.insertQuery(
      address1,
      address2,
      lat1,
      lon1,
      lat2,
      lon2,
      distance
    );

    res.json({ distance_km: distance });

  } catch(error) {
    logger.error(`Error processing request: ${error.message}`);
    res.status(500).json({ error: 'Error during distance calculation' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
