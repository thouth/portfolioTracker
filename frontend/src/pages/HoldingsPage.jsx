// HoldingsPage.jsx
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function HoldingsPage() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHoldings = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/holdings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setHoldings(data);
    };

    if (user) fetchHoldings();
  }, [user]);

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4">Mine Beholdninger</h1>
      <table className="min-w-full text-sm divide-y divide-gray-700 bg-gray-900 border border-gray-700 rounded">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-left">Ticker</th>
            <th className="p-3 text-left">Navn</th>
            <th className="p-3 text-right">Antall</th>
            <th className="p-3 text-right">Snittpris</th>
            <th className="p-3 text-right">Nåværende Pris</th>
            <th className="p-3 text-right">Markedsverdi</th>
            <th className="p-3 text-right">Urealisert P/L</th>
            <th className="p-3 text-right">% av Portefølje</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr
              key={h.ticker}
              className="hover:bg-gray-800 cursor-pointer"
              onClick={() => navigate(`/holdings/${h.ticker}`)}
            >
              <td className="p-3">{h.ticker}</td>
              <td className="p-3">{h.name || '-'}</td>
              <td className="p-3 text-right">{h.total_shares}</td>
              <td className="p-3 text-right">${h.avg_cost.toFixed(2)}</td>
              <td className="p-3 text-right">${h.current_price.toFixed(2)}</td>
              <td className="p-3 text-right">${h.market_value.toFixed(2)}</td>
              <td className="p-3 text-right">${h.unrealized_pl.toFixed(2)}</td>
              <td className="p-3 text-right">{(h.portfolio_pct * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
