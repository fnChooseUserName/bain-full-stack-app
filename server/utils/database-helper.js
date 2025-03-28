const { Pool } = require('pg');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

class DatabaseHelper {

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  // Hashing function for deduplication
  generateHash(lat1, lon1, lat2, lon2) {
    return crypto
      .createHash('sha256')
      .update(`${lat1}-${lon1}-${lat2}-${lon2}`)
      .digest('hex');
  }

  // Insert a new query into the database
  async insertQuery(address1, address2, lat1, lon1, lat2, lon2, distance) {
    const hash = this.generateHash(lat1, lon1, lat2, lon2);

    try {
      const query = `
        INSERT INTO distance_queries (address1, address2, lat1, lon1, lat2, lon2, distance_km, query_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (query_hash) DO NOTHING;
      `;

      await this.pool.query(query, [address1, address2, lat1, lon1, lat2, lon2, distance, hash]);
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  }


  // Retrieval of historical records
  async getQueryHistory() {
    try {
      const result = await this.pool.query('SELECT * FROM distance_queries ORDER BY id DESC;');
      return result.rows;

    } catch(error) {
      console.error(`[Database] Error retrieving records: ${error}`)
      throw error;
    }
  }
}

module.exports = new DatabaseHelper();
