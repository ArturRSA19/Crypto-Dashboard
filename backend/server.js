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
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const CRYPTO_CACHE_TTL_MS = 60 * 1000;
const COINGECKO_RETRY_ATTEMPTS = 3;
const COINGECKO_RETRY_BASE_DELAY_MS = 700;

const ANALYSIS_WINDOW_MS = 60 * 1000;
const ANALYSIS_MAX_REQUESTS = 6;
const analysisRateLimiter = new Map();
let cryptoCache = {
  data: null,
  fetchedAt: 0,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor && typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
};

const checkAnalysisLimit = (ip) => {
  const now = Date.now();
  const bucket = analysisRateLimiter.get(ip);

  if (!bucket || now - bucket.windowStart > ANALYSIS_WINDOW_MS) {
    analysisRateLimiter.set(ip, { count: 1, windowStart: now });
    return { limited: false, retryAfterSec: 0 };
  }

  if (bucket.count >= ANALYSIS_MAX_REQUESTS) {
    const retryAfterSec = Math.ceil((ANALYSIS_WINDOW_MS - (now - bucket.windowStart)) / 1000);
    return { limited: true, retryAfterSec };
  }

  bucket.count += 1;
  analysisRateLimiter.set(ip, bucket);
  return { limited: false, retryAfterSec: 0 };
};

const fetchCoinGeckoMarkets = async () => {
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
  const params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 100,
    page: 1,
    sparkline: true,
    price_change_percentage: '24h',
  };

  let lastError;
  for (let attempt = 1; attempt <= COINGECKO_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await axios.get(apiUrl, {
        params,
        timeout: 15000,
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      const isRetryable = status === 429 || (status >= 500 && status < 600);

      if (!isRetryable || attempt === COINGECKO_RETRY_ATTEMPTS) {
        throw lastError;
      }

      await sleep(COINGECKO_RETRY_BASE_DELAY_MS * attempt);
    }
  }

  throw lastError;
};

const buildAnalysisPrompt = ({ coinName, coinSymbol, currentPrice, change24h }) => {
  return `Provide a concise, beginner-friendly analysis for the cryptocurrency ${coinName} (${coinSymbol}). The current price is $${currentPrice.toFixed(2)} with a 24-hour change of ${change24h.toFixed(2)}%. Cover these points in separate paragraphs:\n\n1. What it is: Briefly explain the coin's main purpose and technology.\n2. Recent Performance: Comment on its recent price movement and what it might indicate.\n3. Future Outlook: Give a balanced view of its potential future, mentioning possible risks and opportunities.\n\nKeep the tone neutral and informative.`;
};

const callOpenAIAnalysis = async (prompt) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 500,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      timeout: 30000,
    }
  );

  const text = response?.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenAI returned an unexpected response format.');
  }

  return text;
};

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
  const now = Date.now();
  const hasFreshCache =
    Array.isArray(cryptoCache.data) &&
    cryptoCache.data.length > 0 &&
    now - cryptoCache.fetchedAt < CRYPTO_CACHE_TTL_MS;

  if (hasFreshCache) {
    res.set('X-Data-Source', 'cache');
    return res.status(200).json(cryptoCache.data);
  }

  try {
    const data = await fetchCoinGeckoMarkets();
    cryptoCache = {
      data,
      fetchedAt: Date.now(),
    };

    res.set('X-Data-Source', 'coingecko');
    return res.status(200).json(data);

  } catch (error) {
    const status = error?.response?.status;
    console.error('Error fetching data from CoinGecko:', status || error.message);

    const hasAnyCache = Array.isArray(cryptoCache.data) && cryptoCache.data.length > 0;
    if (hasAnyCache && (status === 429 || !status || (status >= 500 && status < 600))) {
      res.set('X-Data-Source', 'stale-cache');
      return res.status(200).json(cryptoCache.data);
    }
    
    if (status === 429) {
      return res.status(429).json({
        message: 'CoinGecko rate limit reached. Please try again in a few moments.',
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        message: 'Error fetching data from external API.',
        details: error.response.data,
      });
    }

    return res.status(500).json({
      message: 'Internal Server Error. Could not fetch cryptocurrency data.',
    });
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

/**
 * @route   POST /api/analyze
 * @desc    Generate AI analysis for a cryptocurrency using OpenAI
 * @access  Public
 */
app.post('/api/analyze', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(503).json({
        message: 'OpenAI API key not configured on backend. Set OPENAI_API_KEY in backend .env.',
      });
    }

    const ip = getClientIp(req);
    const { limited, retryAfterSec } = checkAnalysisLimit(ip);
    if (limited) {
      return res.status(429).json({
        message: `Too many analysis requests. Try again in about ${retryAfterSec} seconds.`,
      });
    }

    const { coinName, coinSymbol, currentPrice, change24h } = req.body || {};
    if (!coinName || !coinSymbol || typeof currentPrice !== 'number' || typeof change24h !== 'number') {
      return res.status(400).json({
        message: 'Invalid payload. Required fields: coinName, coinSymbol, currentPrice, change24h.',
      });
    }

    const prompt = buildAnalysisPrompt({ coinName, coinSymbol, currentPrice, change24h });
    const analysis = await callOpenAIAnalysis(prompt);
    return res.status(200).json({ analysis, provider: 'openai' });
  } catch (error) {
    const status = error?.response?.status;
    const details = error?.response?.data;

    console.error('Error generating AI analysis:', status || error.message);

    if (status === 429) {
      return res.status(429).json({
        message: 'OpenAI rate limit/quota exceeded. Please try again later and verify usage limits.',
        details,
      });
    }

    if (status && status >= 400 && status < 500) {
      return res.status(status).json({
        message: 'OpenAI request rejected. Verify backend API key and request quota.',
        details,
      });
    }

    return res.status(500).json({
      message: 'Internal Server Error. Could not generate AI analysis.',
    });
  }
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('API endpoint available at http://localhost:5000/api/crypto');
});
