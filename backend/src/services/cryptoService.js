// services/cryptoService.js
import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getCryptoPrices(vsCurrency = 'brl', perPage = 15, page = 1) {
  const response = await axios.get(`${BASE_URL}/coins/markets`, {
    params: {
      vs_currency: vsCurrency,
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: true,        // ← ATIVADO
      price_change_percentage: '24h'
    },
  });
  return response.data;
}

// Já existente: busca as moedas em tendência de busca
export async function getTrendingCryptos() {
  const response = await axios.get(`${BASE_URL}/search/trending`);
  return response.data.coins.map((c) => c.item);
}
