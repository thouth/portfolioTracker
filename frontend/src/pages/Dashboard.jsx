import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    user?.getIdToken().then((token) => {
      fetch('http://localhost:8000/api/protected', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setData)
        .catch(console.error);
    });
  }, [user]);

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-4">{data ? JSON.stringify(data) : 'Laster...'}</p>
      <button onClick={logout} className="mt-6 text-red-400">Logg ut</button>
    </div>
  );
}
