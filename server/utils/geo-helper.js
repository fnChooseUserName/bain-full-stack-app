const axios = require('axios');

class GeoHelper {
  
  // Geocode function
  async geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search`;
    const params = {
      q: address,
      format: 'json',
      limit: 1,
    };

    try {
      const response = await axios.get(url, { params });
      const data = response.data;

      if (data.length === 0) {
        throw new Error(`Geocoding failed for address: ${address}`);
      }

      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };

    } catch (error) {
      console.error(`Geocoding error for ${address}:`, error.message);
      throw error;
    }
  }

    // Reference: https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/
    calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    // Conversion of degree to Radians
    const toRad = (degree) => ( degree * Math.PI) / 180;
    
    // Appox. radius of Earth, in KM
    const R = 6371;

    // Apply conversions
    const rLat1 = toRad(lat1);
    const rLon1 = toRad(lon1);
    const rLat2 = toRad(lat2);
    const rLon2 = toRad(lon2);

    // Delta of radians
    const dLat = rLat2 - rLat1;
    const dLon = rLon2 - rLon1;

    // Apply the Haversine formulae
    const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(rLat1) *
                Math.cos(rLat2) *
                Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
    };
}

module.exports = new GeoHelper();
