import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      const { data: sessionData } = await user?.getSession?.();
      const token = sessionData?.session?.access_token;

      try {
        const res = await fetch('http://localhost:8000/api/holdings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHoldings(data.holdings || []);
        setTotal(data.total_value || 0);
      } catch (err) {
        console.error("Kunne ikke hente holdings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchHoldings();
  }, [user]);

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Min Portefølje</h1>
        <button onClick={logout} className="text-red-400 hover:underline">Logg ut</button>
      </div>

      {loading ? (
        <p>Laster portefølje...</p>
      ) : (
        <>
          <div className="text-lg mb-4">
            Total verdi: <span className="font-bold">${total.toLocaleString()}</span>
          </div>

          <table className="min-w-full text-sm divide-y divide-gray-700 bg-gray-900 border border-gray-700 rounded">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left">Ticker</th>
                <th className="p-3 text-right">Antall</th>
                <th className="p-3 text-right">Snittpris</th>
                <th className="p-3 text-right">Markedspris</th>
                <th className="p-3 text-right">Verdi</th>
                <th className="p-3 text-right">Urealisert P/L</th>
                <th className="p-3 text-right">% av portefølje</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.ticker} className="hover:bg-gray-800">
                  <td className="p-3 font-semibold">{h.ticker}</td>
                  <td className="p-3 text-right">{h.shares}</td>
                  <td className="p-3 text-right">${h.avg_cost.toFixed(2)}</td>
                  <td className="p-3 text-right">${h.current_price.toFixed(2)}</td>
                  <td className="p-3 text-right">${h.market_value.toFixed(2)}</td>
                  <td className={`p-3 text-right ${h.unrealized_pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${h.unrealized_pl.toFixed(2)}
                  </td>
                  <td className="p-3 text-right">{h.portfolio_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
