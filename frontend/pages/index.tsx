import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

export default function Home() {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/crypto-prices');
        setCryptos(res.data);
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
        <h1 className="text-3xl font-bold mb-4">📊 Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cryptos.map((coin: any) => (
            <div key={coin.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow">
              <div className="flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5 my-4 mx-0.9" />
                <h2 className="text-xl font-semibold">{coin.name} ({coin.symbol.toUpperCase()})</h2>
              </div>
              <p>💰 Preço atual: R$ {coin.current_price.toLocaleString('pt-BR')}</p>
              <p>📈 Variação 24h: {coin.price_change_percentage_24h.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
