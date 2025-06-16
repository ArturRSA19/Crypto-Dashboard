import { SparklineChart } from './SparklineChart';

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

interface Props {
  cryptos: Crypto[];
}

export function CryptoTable({ cryptos }: Props) {
  return (
    <div className="overflow-auto w-full">
      <table className="w-full table-auto border-separate border-spacing-y-2">
        <thead className="text-left text-sm text-muted-foreground">
          <tr>
            <th>Cripto</th>
            <th>Preço</th>
            <th>Últ. 7d</th>
            <th>24h %</th>
            <th>Market Cap</th>
            <th>Volume (24h)</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map(coin => {
            const positive = coin.price_change_percentage_24h >= 0;
            return (
              <tr key={coin.id} className="bg-card hover:bg-muted transition-colors">
                <td className="flex items-center gap-2 py-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
                  </div>
                </td>
                <td className="py-2">
                  R${coin.current_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2">
                  <SparklineChart data={coin.sparkline_in_7d.price} positive={positive} />
                </td>
                <td className={`py-2 ${positive ? 'text-green-500' : 'text-red-500'}`}>
                  {positive ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </td>
                <td className="py-2">
                  R${(coin.market_cap / 1e12).toFixed(1)} tri
                </td>
                <td className="py-2">
                  R${(coin.total_volume / 1e9).toFixed(1)} bi
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
