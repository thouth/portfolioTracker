import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import StockChart from '../components/StockChart';
import { supabase } from '../lib/supabaseClient';

export default function StockDetail() {
  const { ticker } = useParams();
  const { user } = useAuth();
  const [stock, setStock] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const resStock = await fetch(`http://localhost:8000/api/holdings/${ticker}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const stockData = await resStock.json();
      setStock(stockData);

      const resTx = await fetch('http://localhost:8000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allTx = await resTx.json();
      setTransactions(allTx.filter((t) => t.ticker === ticker.toUpperCase()));
    };

    if (user) fetchData();
  }, [ticker, user]);

  if (!stock) return <p className="text-white p-6">Laster...</p>;

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">{stock.name} ({stock.ticker})</h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p><strong>Antall:</strong> {stock.total_shares}</p>
          <p><strong>Snittpris:</strong> ${stock.avg_cost.toFixed(2)}</p>
          <p><strong>Nåværende pris:</strong> ${stock.current_price.toFixed(2)}</p>
        </div>
        <div>
          <p><strong>Markedsverdi:</strong> ${stock.market_value.toFixed(2)}</p>
          <p><strong>Urealisert P/L:</strong> ${stock.unrealized_pl.toFixed(2)}</p>
          <p><strong>% av portefølje:</strong> {(stock.portfolio_pct * 100).toFixed(2)}%</p>
        </div>
      </div>

      <StockChart ticker={ticker} />

      <div className="mt-8">
        <h2 className="text-xl mb-3">Transaksjonshistorikk</h2>
        <table className="min-w-full text-sm divide-y divide-gray-700 bg-gray-800 rounded">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-left">Dato</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-right">Antall</th>
              <th className="p-3 text-right">Pris</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-700">
                <td className="p-3">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="p-3 capitalize">{tx.type}</td>
                <td className="p-3 text-right">{tx.quantity}</td>
                <td className="p-3 text-right">${tx.price.toFixed(2)}</td>
                <td className="p-3 text-right">${(tx.quantity * tx.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
