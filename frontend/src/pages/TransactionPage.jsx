import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TransactionModal from '../components/TransactionModal';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

export default function TransactionPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        toast.error('Feil ved henting av transaksjoner');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTransactions();
  }, [user]);

  const handleSave = async (tx) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tx),
    });

    if (res.ok) {
      const newTx = await res.json();
      setTransactions((prev) => [...prev, newTx]);
      toast.success('Transaksjon lagret');
    } else {
      toast.error('Feil ved lagring av transaksjon');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Er du sikker på at du vil slette denne transaksjonen?')) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      toast.success('Transaksjon slettet');
    } else {
      toast.error('Kunne ikke slette transaksjonen');
    }
  };

  const handleUpdate = async (updatedTx) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${updatedTx.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTx),
    });

    if (res.ok) {
      const data = await res.json();
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === data.id ? data : tx))
      );
      setEditingTx(null);
      toast.success('Transaksjon oppdatert');
    } else {
      toast.error('Kunne ikke oppdatere transaksjon');
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Mine Transaksjoner</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Legg til transaksjon
        </button>
      </div>

      {loading ? (
        <p>Laster transaksjoner...</p>
      ) : (
        <table className="min-w-full text-sm divide-y divide-gray-700 bg-gray-900 border border-gray-700 rounded">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Dato</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Ticker</th>
              <th className="p-3 text-right">Antall</th>
              <th className="p-3 text-right">Pris</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-right">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-800">
                <td className="p-3">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="p-3">{tx.trade_type}</td>
                <td className="p-3">{tx.ticker}</td>
                <td className="p-3 text-right">{tx.shares}</td>
                <td className="p-3 text-right">${tx.price.toFixed(2)}</td>
                <td className="p-3 text-right">${(tx.price * tx.shares).toFixed(2)}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => setEditingTx(tx)}
                    className="text-yellow-400 hover:underline"
                  >
                    Rediger
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="text-red-400 hover:underline"
                  >
                    Slett
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
      <TransactionModal
        isOpen={!!editingTx}
        onClose={() => setEditingTx(null)}
        onSave={handleUpdate}
        transaction={editingTx}
      />
    </div>
  );
}
