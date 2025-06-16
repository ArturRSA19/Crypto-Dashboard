import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CryptoCardProps {
  coin: any;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ coin }) => {
  const change = coin.price_change_percentage_24h;
  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-2">
        <img src={coin.image} alt={coin.name} className="w-6 h-6" />
        <h2 className="text-lg font-semibold">
          {coin.name}{' '}
          <span className="text-sm text-muted-foreground">({coin.symbol.toUpperCase()})</span>
        </h2>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          <span>R$ {coin.current_price.toLocaleString('pt-BR')}</span>
        </div>
        <div className={`flex items-center gap-1 ${changeColor}`}>
          <ChangeIcon className="w-4 h-4" />
          <span>{change.toFixed(2)}%</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        <div>24h Máx: R$ {coin.high_24h.toLocaleString('pt-BR')}</div>
        <div>24h Mín: R$ {coin.low_24h.toLocaleString('pt-BR')}</div>
      </div>
    </div>
  );
};
