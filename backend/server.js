// To run this code:
// 1. Make sure you have Node.js and npm installed.
// 2. Create a new directory for your project.
// 3. Save this file as `server.js`.
// 4. Run `npm init -y` in your terminal in the project directory.
// 5. Run `npm install express axios cors`.
// 6. Run `node server.js` to start the server.

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Enable CORS for all routes, allowing your React app to make requests
app.use(cors());
// Parse JSON bodies
app.use(express.json());

/**
 * @route   GET /api/crypto
 * @desc    Get cryptocurrency market data from CoinGecko
 * @access  Public
 */
app.get('/api/crypto', async (req, res) => {
  try {
    // The CoinGecko API endpoint for fetching market data
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';

    // Parameters for the API request
    // You can customize these as needed
    const params = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 100, // Number of coins to fetch
      page: 1,
      sparkline: true, // Include 7-day sparkline data for charts
      price_change_percentage: '24h',
    };

    // Make the GET request to the CoinGecko API
    const response = await axios.get(apiUrl, { params });

    // Send the data from CoinGecko back to the client
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error.message);
    
    // Handle potential errors from the API (e.g., rate limiting)
    if (error.response) {
      res.status(error.response.status).json({
        message: 'Error fetching data from external API.',
        details: error.response.data,
      });
    } else {
      res.status(500).json({
        message: 'Internal Server Error. Could not fetch cryptocurrency data.'
      });
    }
  }
});

/**
 * @route   GET /api/news
 * @desc    Get latest cryptocurrency news
 * @access  Public
 */
app.get('/api/news', async (req, res) => {
  try {
    const apiUrl = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';
    const response = await axios.get(apiUrl);
    // CryptoCompare returns news articles in the `Data` property
    if (response.data && response.data.Data) {
      res.status(200).json(response.data.Data);
    } else {
      res.status(500).json({ message: 'Invalid response from news API' });
    }
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ message: 'Could not fetch news data' });
  }
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('API endpoint available at http://localhost:5000/api/crypto');
});
