import { getCryptoPrices } from '../services/cryptoService.js';

export async function fetchPrices(req, res) {
  try {
    const data = await getCryptoPrices();
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar dados da CoinGecko:', error.message);
    res.status(500).json({ error: 'Erro ao buscar dados de criptomoedas' });
  }
}
