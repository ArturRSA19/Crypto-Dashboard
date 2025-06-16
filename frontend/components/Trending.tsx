interface TrendingItem {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  data: {
    price: number;
    price_change_percentage_24h: { [currency: string]: number };
  };
}

interface TrendingProps {
  items: TrendingItem[];
}

export function Trending({ items }: TrendingProps) {
  if (!items.length) return null;

  return (
    <section className="mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-2">Trending</h2>
<div className="overflow-x-auto py-2 trending-scroll">
          <div className="flex space-x-4 w-max">
            {items.map(item => {
              const change = item.data.price_change_percentage_24h['usd'] ?? 0;
              const positive = change >= 0;
              return (
                <div
                  key={item.id}
                  className="min-w-[160px] p-4 bg-card rounded-lg shadow flex-shrink-0"
                >
                  <img src={item.thumb} alt={item.name} className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-center">{item.name}</h3>
                  <p className="text-sm text-muted-foreground text-center uppercase">{item.symbol}</p>
                  <p className="mt-2 text-center">${item.data.price.toFixed(4)}</p>
                  <p className={`text-sm text-center mt-1 ${positive ? 'text-green-500' : 'text-red-500'}`}>
                    {positive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
