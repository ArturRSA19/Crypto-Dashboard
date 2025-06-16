import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { PageTitle } from '../components/PageTitle';
import { Trending } from '../components/Trending';
import { SearchBar } from '../components/SearchBar';
import { CryptoTable } from '../components/CryptoTable';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
}

export default function Home() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [trending, setTrending] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coinsRes, trendingRes] = await Promise.all([
          axios.get('http://localhost:5001/api/crypto-prices'),
          axios.get('http://localhost:5001/api/crypto-trending'),
        ]);
        setCryptos(coinsRes.data);
        setTrending(trendingRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  const filtered = cryptos.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="px-4 py-6 max-w-7xl mx-auto w-full">
        <PageTitle />
        <Trending items={trending} />
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CryptoTable cryptos={filtered} />
      </main>
    </div>
  );
}
