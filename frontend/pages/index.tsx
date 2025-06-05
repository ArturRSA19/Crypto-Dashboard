import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { LineChart, DollarSign, TrendingUp } from 'lucide-react';

export default function Home() {
  const [cryptos, setCryptos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/crypto-prices');
        // Normaliza para evitar null
        const normalized = res.data.map((coin: any) => ({
          ...coin,
          price_change_percentage_24h: coin.price_change_percentage_24h ?? null,
        }));
        setCryptos(normalized);
      } catch (error) {
        console.error('Erro ao buscar dados de criptomoedas:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <Header />

      <main className="p-4 mx-auto">
        <h1 className="flex items-center gap-2 text-3xl mb-4">
          <LineChart className="w-6 h-6" />
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cryptos.map((coin: any) => (
            <div key={coin.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
              <div className="flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5 -mx-0.5" />
                <h2 className="text-xl font-semibold">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </h2>
              </div>

              <p className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 mr-2" />
                Preço atual: R$ {coin.current_price.toLocaleString('pt-BR')}
              </p>

              <p className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 mr-2" />
                Variação 24h:{' '}
                {coin.price_change_percentage_24h != null
                  ? `${coin.price_change_percentage_24h.toFixed(2)}%`
                  : '–'}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
