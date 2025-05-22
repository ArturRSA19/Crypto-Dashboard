import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getCryptoPrices() {
  const response = await axios.get(`${BASE_URL}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 250, // ou 50, 100, etc.
      page: 1,
      sparkline: false
    }
  });

  return response.data;
}
