import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passordene matcher ikke");
      return;
    }

    const { error } = await register(email, password);
    if (error) {
      alert(error.message);
    } else {
      alert("Registrering vellykket. Du kan nå logge inn.");
      navigate('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 space-y-4">
      <h2 className="text-xl font-semibold text-white">Registrer deg</h2>

      <input
        type="email"
        placeholder="E-post"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="form-input w-full rounded bg-gray-800 text-white border border-gray-600 p-2"
      />

      <input
        type="password"
        placeholder="Passord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="form-input w-full rounded bg-gray-800 text-white border border-gray-600 p-2"
      />

      <input
        type="password"
        placeholder="Bekreft passord"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        className="form-input w-full rounded bg-gray-800 text-white border border-gray-600 p-2"
      />

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Registrer
      </button>
    </form>
  );
}
