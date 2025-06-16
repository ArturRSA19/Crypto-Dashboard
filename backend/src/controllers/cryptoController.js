import { getCryptoPrices, getTrendingCryptos } from '../services/cryptoService.js';  // :contentReference[oaicite:0]{index=0}

export async function fetchPrices(req, res) {
  try {
    const data = await getCryptoPrices();
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar dados da CoinGecko:', error.message);
    res.status(500).json({ error: 'Erro ao buscar dados de criptomoedas' });
  }
}

// Nova rota para retornar os trending coins
export async function fetchTrending(req, res) {
  try {
    const data = await getTrendingCryptos();
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar trending da CoinGecko:', error.message);
    res.status(500).json({ error: 'Erro ao buscar moedas em tendência' });
  }
}
