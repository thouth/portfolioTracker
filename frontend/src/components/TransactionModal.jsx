import { useEffect, useState } from 'react';

export default function TransactionModal({ isOpen, onClose, onSave, transaction }) {
  const [form, setForm] = useState(
    transaction || {
      date: '',
      trade_type: 'buy',
      ticker: '',
      shares: '',
      price: '',
    }
  );

  useEffect(() => {
    if (transaction) setForm(transaction);
  }, [transaction]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl mb-4">{transaction ? 'Rediger' : 'Ny'} Transaksjon</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="date"
            type="date"
            className="w-full p-2 bg-gray-700 rounded"
            onChange={handleChange}
            value={form.date}
            required
          />
          <select
            name="trade_type"
            className="w-full p-2 bg-gray-700 rounded"
            onChange={handleChange}
            value={form.trade_type}
          >
            <option value="buy">Kjøp</option>
            <option value="sell">Salg</option>
          </select>
          <input
            name="ticker"
            placeholder="Ticker"
            className="w-full p-2 bg-gray-700 rounded"
            onChange={handleChange}
            value={form.ticker}
            required
          />
          <input
            name="shares"
            type="number"
            placeholder="Antall"
            className="w-full p-2 bg-gray-700 rounded"
            onChange={handleChange}
            value={form.shares}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Pris"
            className="w-full p-2 bg-gray-700 rounded"
            onChange={handleChange}
            value={form.price}
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="text-red-400">
              Avbryt
            </button>
            <button type="submit" className="bg-green-600 px-4 py-2 rounded">
              {transaction ? 'Oppdater' : 'Lagre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
