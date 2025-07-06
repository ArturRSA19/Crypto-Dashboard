import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Moon, Search, ChevronUp, ChevronDown, Activity, Sparkles, X, Github } from 'lucide-react';

// --- Mock Data (used as a fallback) ---
const mockCryptoData = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400', current_price: 61000.50, price_change_percentage_24h: 1.25, market_cap: 1200000000000, sparkline_in_7d: { price: [60000, 61500, 61000, 62000, 61800, 62500, 61000.50] } },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501638', current_price: 3400.75, price_change_percentage_24h: -0.50, market_cap: 408000000000, sparkline_in_7d: { price: [3450, 3380, 3420, 3350, 3410, 3390, 3400.75] } },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1696504756', current_price: 135.20, price_change_percentage_24h: 5.75, market_cap: 62000000000, sparkline_in_7d: { price: [128, 130, 132, 129, 135, 138, 135.20] } },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1696502090', current_price: 0.38, price_change_percentage_24h: -2.10, market_cap: 13000000000, sparkline_in_7d: { price: [0.39, 0.385, 0.392, 0.381, 0.375, 0.385, 0.38] } },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1696501409', current_price: 0.12, price_change_percentage_24h: 3.40, market_cap: 17000000000, sparkline_in_7d: { price: [0.115, 0.118, 0.122, 0.119, 0.125, 0.123, 0.12] } },
];


// --- Helper Functions ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatMarketCap = (value) => {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  return value.toString();
};


// --- Components ---

const ThemeSwitcher = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
    aria-label="Toggle theme"
  >
    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);

const Header = ({ theme, toggleTheme, searchTerm, setSearchTerm }) => (
  <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
    <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">CryptoDash</h1>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search coin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-40 md:w-64 pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <a
        href="https://github.com/ArturRSA19/Crypto-Dashboard"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Repository"
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <Github className="w-5 h-5" />
      </a>
      <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
    </div>
  </header>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-bold text-gray-900 dark:text-white">{`Price: ${formatCurrency(payload[0].value)}`}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{`Day: ${label}`}</p>
      </div>
    );
  }
  return null;
};


const CoinChart = ({ data, isPositive }) => {
  const chartData = data.price.map((price, index) => ({ name: `Day ${index + 1}`, price }));
  const strokeColor = isPositive ? '#22c55e' : '#ef4444'; // green-500 or red-500
  const fillColor = isPositive ? 'url(#positiveGradient)' : 'url(#negativeGradient)';

  return (
    <div className="w-full h-16">
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
           <defs>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
            </defs>
          <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} fillOpacity={1} fill={fillColor} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};


const CoinRow = ({ coin }) => {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 items-center p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
        <div className="col-span-1 flex items-center gap-3">
            <img src={coin.image} alt={coin.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
            <div>
                <p className="font-bold text-sm md:text-base text-gray-900 dark:text-white">{coin.name}</p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</p>
            </div>
        </div>
        <div className="col-span-1 text-right md:text-left">
            <p className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-200">{formatCurrency(coin.current_price)}</p>
        </div>
        <div className={`col-span-1 flex items-center justify-end md:justify-start ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="font-semibold text-sm md:text-base ml-1">{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
        </div>
        <div className="hidden md:block col-span-1">
            <p className="font-medium text-gray-800 dark:text-gray-200">{formatMarketCap(coin.market_cap)}</p>
        </div>
        <div className="hidden md:block col-span-1">
            {coin.sparkline_in_7d && coin.sparkline_in_7d.price ? (
                <CoinChart data={coin.sparkline_in_7d} isPositive={isPositive} />
            ) : <div className="h-16 w-full flex items-center justify-center text-gray-400">No chart data</div>}
        </div>
    </div>
  );
};

const CoinList = ({ coins }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md flex flex-col h-[600px]">
        {/* Table Header (Sticky) */}
        <div className="grid grid-cols-3 md:grid-cols-5 p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
            <p className="col-span-1 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coin</p>
            <p className="col-span-1 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right md:text-left">Price</p>
            <p className="col-span-1 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right md:text-left">24h Change</p>
            <p className="hidden md:block col-span-1 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Market Cap</p>
            <p className="hidden md:block col-span-1 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last 7 Days</p>
        </div>
        
        {/* Scrollable Coin Rows */}
        <div className="overflow-y-auto">
            {coins.length > 0 ? (
                coins.map(coin => <CoinRow key={coin.id} coin={coin} />)
            ) : (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                    <p>No coins found.</p>
                </div>
            )}
        </div>
    </div>
  );
};

const AnalysisModal = ({ isOpen, onClose, coin, analysis, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Analysis: {coin?.name}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Our AI is analyzing the data...</p>
                        </div>
                    ) : (
                        <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
                           <p>{analysis}</p>
                        </div>
                    )}
                </div>
                 <footer className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Generated by Gemini. Not financial advice. Always do your own research.</p>
                </footer>
            </div>
        </div>
    );
};


const MainChart = ({ coinData, selectedCoin, setSelectedCoin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const activeCoin = coinData.find(c => c.id === selectedCoin);

    const chartData = useMemo(() => {
        if (!activeCoin || !activeCoin.sparkline_in_7d || !activeCoin.sparkline_in_7d.price) {
            return [];
        }
        return activeCoin.sparkline_in_7d.price.map((price, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                price: price
            };
        });
    }, [activeCoin]);

    const handleAnalyzeCoin = async () => {
        if (!activeCoin) return;

        setIsModalOpen(true);
        setIsAnalyzing(true);
        setAnalysis('');

        const prompt = `Provide a concise, beginner-friendly analysis for the cryptocurrency ${activeCoin.name} (${activeCoin.symbol}). The current price is ${formatCurrency(activeCoin.current_price)} with a 24-hour change of ${activeCoin.price_change_percentage_24h.toFixed(2)}%. Cover these points in separate paragraphs:\n\n1.  **What it is:** Briefly explain the coin's main purpose and technology.\n2.  **Recent Performance:** Comment on its recent price movement and what it might indicate.\n3.  **Future Outlook:** Give a balanced view of its potential future, mentioning possible risks and opportunities.\n\nKeep the tone neutral and informative.`;
        
        try {
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setAnalysis(text);
            } else {
                 throw new Error("Invalid response structure from API.");
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            setAnalysis("Sorry, an error occurred while generating the analysis. Please try again later.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!activeCoin) {
        return (
            <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <p className="text-gray-500 dark:text-gray-400">Select a coin to view chart</p>
            </div>
        );
    }

    const isPositive = activeCoin.price_change_percentage_24h >= 0;
    const strokeColor = isPositive ? '#22c55e' : '#ef4444';
    const fillGradient = isPositive ? 'url(#chartPositiveGradient)' : 'url(#chartNegativeGradient)';

    return (
        <>
            <AnalysisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} coin={activeCoin} analysis={analysis} isLoading={isAnalyzing} />
            <div className="p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <img src={activeCoin.image} alt={activeCoin.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeCoin.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 uppercase">{activeCoin.symbol}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(activeCoin.current_price)}</p>
                         <p className={`flex items-center justify-end text-lg font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            {Math.abs(activeCoin.price_change_percentage_24h).toFixed(2)}%
                        </p>
                    </div>
                </div>
                <div className="h-80 w-full mb-4">
                    <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="chartPositiveGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="chartNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} stroke="rgb(156 163 175 / 0.5)" />
                            <XAxis dataKey="date" tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis
                                tickFormatter={(val) => formatCurrency(val)}
                                tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                domain={['dataMin', 'dataMax']}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="price" stroke={strokeColor} fill={fillGradient} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                 <div className="flex justify-center">
                    <button onClick={handleAnalyzeCoin} disabled={isAnalyzing} className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span>{isAnalyzing ? 'Analyzing...' : `✨ AI Analysis for ${activeCoin.name}`}</span>
                    </button>
                </div>
            </div>
        </>
    );
};


export default function App() {
  const [theme, setTheme] = useState('dark');
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/crypto');
        
        if (!response.ok) {
          throw new Error(`Backend API Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            throw new Error("Backend returned no data.");
        }
        
        setCoins(data);

      } catch (err) {
        console.warn("Could not fetch from backend, falling back to mock data.", err.message);
        setError("Could not connect to backend. Displaying mock data.");
        setCoins(mockCryptoData);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      <main className="p-4 md:p-6 space-y-6">
        {loading && <div className="text-center p-8">Loading...</div>}
        {error && <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-lg">{error}</div>}
        {!loading && (
             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <MainChart coinData={coins} selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} />
                </div>
                <div className="xl:col-span-1 h-[520px] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-2 space-y-2">
                     <h3 className="text-lg font-bold p-2">Top Movers</h3>
                     {coins.slice(0, 10).map(coin => (
                         <div key={coin.id} onClick={() => setSelectedCoin(coin.id)} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedCoin === coin.id ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
                            <div className="flex items-center gap-3">
                                <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full"/>
                                <div>
                                    <p className="font-bold">{coin.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-right">{formatCurrency(coin.current_price)}</p>
                                <p className={`flex items-center justify-end text-sm font-semibold ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {coin.price_change_percentage_24h >= 0 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                </p>
                            </div>
                         </div>
                     ))}
                </div>
            </div>
        )}
        {!loading && <CoinList coins={filteredCoins} />}
      </main>
    </div>
  );
}
