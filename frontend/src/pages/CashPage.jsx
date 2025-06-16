import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

export default function CashPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCash = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch('http://localhost:8000/api/cash', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setAmount(data.amount || 0);
      setLoading(false);
    };

    if (user) fetchCash();
  }, [user]);

  const handleSave = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch('http://localhost:8000/api/cash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: parseFloat(amount) }),
    });

    if (res.ok) {
      toast.success('Kontantbeløp oppdatert!');
    } else {
      toast.error('Kunne ikke oppdatere kontanter.');
    }
  };

  if (loading) return <div className="p-6 text-white">Laster kontanter...</div>;

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Kontantbeholdning</h1>
      <div className="mb-4">
        <label className="block text-sm mb-1">Nåværende beløp</label>
        <input
          type="number"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Lagre
      </button>
    </div>
  );
}
