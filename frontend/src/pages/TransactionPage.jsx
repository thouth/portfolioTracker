import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function TransactionPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: sessionData } = await user?.getSession?.();
      const token = sessionData?.session?.access_token;

      try {
        const res = await fetch('http://localhost:8000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error('Feil ved henting av transaksjoner:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTransactions();
  }, [user]);

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4">Mine Transaksjoner</h1>

      {loading ? (
        <p>Laster transaksjoner...</p>
      ) : (
        <table className="min-w-full text-sm divide-y divide-gray-7
