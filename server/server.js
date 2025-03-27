const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const dotenv = require('dotenv');
const cors = require('cors');
const { Pool } = require('pg');
const winston = require('winston');

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

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
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
// TODO: - Create geocode() function which takes in an address and returns an OSM object
//       - Create calculateHaversineDistance() function which takes in 2 OSM objects and returns a floating point number in km
//       - Extract the coordinates from the OSM object to store in the database
app.post('/distance', async (req, res) => {

  // Parse out addresses from req body
  const { address1, address2 } = req.body;

  try {
    // Geocode addresses here
    // const address1_geocode = geocode(address1);
    // const address2_geocode = geocode(address2);

    // Calculate distance between the 2 points
    // Using "Haversine formula" assuming straight line distance across a sphere
    // const distance = calculateHaversineDistance(address1_geocode, address2_geocode);

    // Store the query in the database for historical record
    // "distance_queries" table schema defined in migration file
    await pool.query(
      `INSERT INTO distance_queries (address1, address2, lat1, lon1, lat2, lon2, distance_km)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [address1, address2, 0, 0, 0, 0, 'distance']
    );

    res.json({ distance_km: 'distance' });

  } catch(error) {
    logger.error(`Error processing request: ${error.message}`);
    res.status(500).json({ error: 'Error during distance calculation' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
