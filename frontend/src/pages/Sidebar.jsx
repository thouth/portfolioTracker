import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="bg-gray-800 text-white w-48 min-h-screen p-4 space-y-4">
      <nav className="flex flex-col space-y-2">
        <NavLink to="/" className="hover:underline">
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className="hover:underline">
          Transaksjoner
        </NavLink>
        <NavLink to="/holdings" className="hover:underline">
          Beholdninger
        </NavLink>
        <NavLink to="/cash" className="hover:underline">
          Kontanter
        </NavLink>
      </nav>
      <button
        onClick={logout}
        className="mt-4 text-sm text-red-400 hover:underline"
      >
        Logg ut
      </button>
    </aside>
  );
}
