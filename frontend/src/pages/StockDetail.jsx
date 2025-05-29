import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StockChart from '../components/StockChart';

export default function StockDetail() {
  const { user } = useAuth();
  const { ticker } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      const { data: sessionData } = await user?.getSession?.();
      const token = sessionData?.session?.access_token;

      const res = await fetch(`http://localhost:8000/api/holdings/${ticker}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setStock(data);
      setLoading(false);
    };

    if (user) fetchStock();
  }, [user, ticker]);

  if (loading) return <div className="p-6 text-white">Laster...</div>;
  if (!stock) return <div className="p-6 text-white">Aksje ikke funnet.</div>;

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4">{stock.name} ({stock.ticker})</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p><strong>Antall:</strong> {stock.total_shares}</p>
          <p><strong>Snittpris:</strong> ${stock.avg_cost.toFixed(2)}</p>
          <p><strong>Markedsverdi:</strong> ${stock.market_value.toFixed(2)}</p>
          <p><strong>Urealisert P/L:</strong> ${stock.unrealized_pl.toFixed(2)}</p>
        </div>
        <div>
          <p><strong>Nåværende pris:</strong> ${stock.current_price.toFixed(2)}</p>
          <p><strong>Industrisektor:</strong> {stock.industry || 'Ukjent'}</p>
          <p><strong>Market Cap:</strong> {stock.market_cap || '-'}</p>
          <p><strong>Dividend Yield:</strong> {stock.dividend_yield || '-'}%</p>
        </div>
      </div>

      <StockChart ticker={ticker} />
    </div>
  );
}
