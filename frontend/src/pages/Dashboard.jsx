import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pie } from 'react-chartjs-2';
import { supabase } from '../lib/supabaseClient';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      try {
        const res = await fetch('http://localhost:8000/api/portfolio-overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOverview(data);
      } catch (err) {
        console.error('Kunne ikke hente oversikt:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOverview();
  }, [user]);

  if (loading || !overview) {
    return (
      <div className="p-6 text-white bg-gray-900 min-h-screen">
        <p>Laster portefølje...</p>
      </div>
    );
  }

  const pieData = {
    labels: overview.holdings.map((h) => h.ticker),
    datasets: [
      {
        data: overview.holdings.map((h) => h.market_value),
        backgroundColor: ['#60a5fa', '#10b981', '#facc15', '#f97316', '#f43f5e'],
      },
    ],
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Min Portefølje</h1>
        <button onClick={logout} className="text-red-400 hover:underline">Logg ut</button>
      </div>

      <div className="text-lg mb-4">
        <p><strong>Total verdi:</strong> ${overview.total_value.toLocaleString()}</p>
        <p>
          <strong>Daglig endring:</strong> ${overview.daily_change.toFixed(2)} (
          {overview.daily_change_pct.toFixed(2)}%)
        </p>
        <p><strong>Kontantbeholdning:</strong> ${overview.cash.toFixed(2)}</p>
      </div>

      <div className="mb-8">
        <Pie data={pieData} />
      </div>

      <table className="min-w-full text-sm divide-y divide-gray-700 bg-gray-900 border border-gray-700 rounded">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-left">Ticker</th>
            <th className="p-3 text-right">Markedsverdi</th>
            <th className="p-3 text-right">% av portefølje</th>
          </tr>
        </thead>
        <tbody>
          {overview.holdings.map((h) => (
            <tr key={h.ticker} className="hover:bg-gray-800">
              <td className="p-3 font-semibold">{h.ticker}</td>
              <td className="p-3 text-right">${h.market_value.toFixed(2)}</td>
              <td className="p-3 text-right">{(h.portfolio_pct * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
