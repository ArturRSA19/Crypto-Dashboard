import React, { useEffect, useState } from 'react';

const mockNews = [
  {
    id: 1,
    title: 'Bitcoin hits new all-time high',
    url: 'https://example.com/bitcoin-high',
    source: 'Example News'
  },
  {
    id: 2,
    title: 'Ethereum upgrade set for next month',
    url: 'https://example.com/eth-upgrade',
    source: 'Example News'
  },
  {
    id: 3,
    title: 'Solana ecosystem continues rapid growth',
    url: 'https://example.com/solana-growth',
    source: 'Example News'
  }
];

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/news');
        if (!response.ok) {
          throw new Error('API error');
        }
        const data = await response.json();
        setNews(data.slice(0, 5));
      } catch (err) {
        console.warn('Failed to fetch news, using mock data.', err.message);
        setNews(mockNews);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 space-y-4">
      <h3 className="text-lg font-bold">Latest News</h3>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {news.map((item) => (
            <li key={item.id} className="border-b border-gray-200 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-black dark:text-gray-300 hover:underline">
                {item.title}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.source}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
